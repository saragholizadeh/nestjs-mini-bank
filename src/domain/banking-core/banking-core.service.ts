import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AccountLockManager } from './account-lock.manager';
import { BalanceValidator } from './balance.validator';
import { TransactionRecorder } from './transaction.recorder';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';
import { TransferLogRepository } from '../../infrastructure/database/repositories/transfer-log.repository';

export interface OperationMeta {
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
  ) {}

  // CREDIT (deposit)
  async credit(
    accountId: string,
    amount: number,
    meta: OperationMeta = {},
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // 1. lock
      const account = await this.lockManager.lock(accountId, manager);

      // 2. validate
      this.validator.validateCredit(account, amount);

      // 3. mutate
      const balanceBefore = Number(account.balance);
      account.balance = balanceBefore + amount;
      await this.accountRepo.saveWithManager(account, manager);

      // 4. record
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
    }); // ← COMMIT
  }

  // DEBIT (withdraw)
  async debit(
    accountId: string,
    amount: number,
    meta: OperationMeta = {},
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      // 1. lock
      const account = await this.lockManager.lock(accountId, manager);

      // 2. validate
      this.validator.validateDebit(account, amount);

      // 3. mutate
      const balanceBefore = Number(account.balance);
      account.balance = balanceBefore - amount;
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
  }

  // TRANSFER
  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number,
    meta: OperationMeta = {},
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

    return { transferLogId };
  }
}
