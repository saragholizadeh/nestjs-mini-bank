import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccountLockManager } from './account-lock.manager';
import { BalanceValidator } from './balance.validator';
import { TransactionRecorder } from './transaction.recorder';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';
import { TransferLogRepository } from '../../infrastructure/database/repositories/transfer-log.repository';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EVENTS } from '../events/event-names';
import {
  MoneyDepositedEvent,
  MoneyWithdrawnEvent,
  TransferCompletedEvent,
} from '../events';

export interface OperationMeta {
  userId: string;
  ipAddress?: string | null;
  idempotencyKey?: string;
  metadata?: Record<string, any>;
}

export interface TransferResult {
  transferLogId: string;
}

@Injectable()
export class LedgerService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly lockManager: AccountLockManager,
    private readonly validator: BalanceValidator,
    private readonly recorder: TransactionRecorder,
    private readonly accountRepo: AccountRepository,
    private readonly transferLogRepo: TransferLogRepository,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  // CREDIT (deposit)
  async credit(
    accountId: string,
    amount: number,
    meta: OperationMeta,
  ): Promise<void> {
    let balanceBefore!: number;
    let balanceAfter!: number;

    await this.dataSource.transaction(async (manager) => {
      const account = await this.lockManager.lock(accountId, manager);
      this.validator.validateCredit(account, amount);

      balanceBefore = Number(account.balance);
      account.balance = balanceBefore + amount;
      balanceAfter = account.balance; // ← assign here

      await this.accountRepo.saveWithManager(account, manager);

      await this.recorder.record(
        {
          account,
          balanceBefore,
          amount,
          type: 'deposit',
          idempotencyKey: meta.idempotencyKey,
          metadata: meta.metadata,
        },
        manager,
      );
    });

    this.eventEmitter.emit(
      EVENTS.MONEY_DEPOSITED,
      new MoneyDepositedEvent(
        meta.userId,
        accountId,
        amount,
        balanceBefore,
        balanceAfter,
        meta.idempotencyKey ?? null,
        meta.ipAddress ?? null,
        new Date(),
      ),
    );
  }

  // DEBIT (withdraw)
  async debit(
    accountId: string,
    amount: number,
    meta: OperationMeta,
  ): Promise<void> {
    let balanceBefore!: number;
    let balanceAfter!: number;
    await this.dataSource.transaction(async (manager) => {
      // 1. lock
      const account = await this.lockManager.lock(accountId, manager);

      // 2. validate
      this.validator.validateDebit(account, amount);

      // 3. mutate

      balanceBefore = Number(account.balance);
      account.balance = balanceBefore - amount;
      balanceAfter = account.balance;

      await this.accountRepo.saveWithManager(account, manager);
      // 4. record
      await this.recorder.record(
        {
          account,
          balanceBefore,
          amount,
          type: 'withdrawal',
          idempotencyKey: meta.idempotencyKey,
          metadata: meta.metadata,
        },
        manager,
      );
    }); // ← COMMIT

    this.eventEmitter.emit(
      EVENTS.MONEY_WITHDRAWN,
      new MoneyWithdrawnEvent(
        meta.userId,
        accountId,
        amount,
        balanceBefore,
        balanceAfter,
        meta.idempotencyKey ?? null,
        meta.ipAddress ?? null,
        new Date(),
      ),
    );
  }

  // TRANSFER
  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    meta: OperationMeta,
  ): Promise<TransferResult> {
    let transferLogId!: string;

    await this.dataSource.transaction(async (manager) => {
      // 1. lock both accounts in fixed order (deadlock prevention)
      const [fromAccount, toAccount] = await this.lockManager.lockTwo(
        fromAccountId,
        toAccountId,
        manager,
      );

      // 2. validate
      this.validator.validateTransfer(fromAccount, toAccount, amount);

      // 3. create transfer log first — transactions reference it
      const transferLog = await this.transferLogRepo.saveWithManager(
        {
          fromAccountId,
          toAccountId,
          amount,
          currencyCode: fromAccount.currencyCode,
          status: 'completed',
          idempotencyKey: meta.idempotencyKey ?? null,
          completedAt: new Date(),
        },
        manager,
      );
      transferLogId = transferLog.id;

      // 4. mutate balances
      const fromBalanceBefore = Number(fromAccount.balance);
      const toBalanceBefore = Number(toAccount.balance);

      fromAccount.balance = fromBalanceBefore - amount;
      toAccount.balance = toBalanceBefore + amount;

      await this.accountRepo.saveWithManager(fromAccount, manager);
      await this.accountRepo.saveWithManager(toAccount, manager);

      // 5. record both sides
      await this.recorder.record(
        {
          account: fromAccount,
          balanceBefore: fromBalanceBefore,
          amount,
          type: 'transfer_out',
          referenceId: transferLog.id,
          idempotencyKey: meta.idempotencyKey,
          metadata: meta.metadata,
        },
        manager,
      );

      await this.recorder.record(
        {
          account: toAccount,
          balanceBefore: toBalanceBefore,
          amount,
          type: 'transfer_in',
          referenceId: transferLog.id,
          metadata: meta.metadata,
        },
        manager,
      );
    }); // ← COMMIT — both sides or neither

    this.eventEmitter.emit(
      EVENTS.TRANSFER_COMPLETED,
      new TransferCompletedEvent(
        meta.userId,
        fromAccountId,
        toAccountId,
        transferLogId,
        amount,
        meta.idempotencyKey ?? null,
        meta.ipAddress ?? null,
        new Date(),
      ),
    );

    return { transferLogId };
  }
}
