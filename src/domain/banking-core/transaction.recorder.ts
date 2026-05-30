import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Account } from '../../infrastructure/database/entities/account.entity';
import { TransactionRepository } from '../../infrastructure/database/repositories/transaction.repository';
import { Transaction } from '../../infrastructure/database/entities/transaction.entity';

export type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'transfer_in'
  | 'transfer_out';

export interface RecordOptions {
  account: Account;
  balanceBefore: number;
  amount: number;
  type: TransactionType;
  idempotencyKey?: string;
  referenceId?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class TransactionRecorder {
  constructor(private readonly transactionRepo: TransactionRepository) {}

  async record(
    options: RecordOptions,
    manager: EntityManager,
  ): Promise<Transaction> {
    const {
      account,
      balanceBefore,
      amount,
      type,
      idempotencyKey,
      referenceId,
      metadata,
    } = options;

    return this.transactionRepo.saveWithManager(
      {
        accountId: account.id,
        type,
        amount,
        currencyCode: account.currencyCode,
        balanceBefore,
        balanceAfter: account.balance, // already mutated at this point
        status: 'completed',
        idempotencyKey: idempotencyKey ?? null,
        referenceId: referenceId ?? null,
        metadata: metadata ?? null,
      },
      manager,
    );
  }
}
