import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Currency } from './currency.entity';
import { TransferLog } from './transfer-log.entity';
import { PROCESS_STATUSES } from 'src/common/constants/transaction.constants';
import type { ProcessStatus, TransactionType } from 'src/common/types/transaction.types';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.transactions)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'reference_id', type: 'uuid', nullable: true })
  referenceId: string | null;

  @ManyToOne(() => TransferLog, (log) => log.transactions, { nullable: true })
  @JoinColumn({ name: 'reference_id' })
  transferLog: TransferLog | null;

  @Column()
  type: TransactionType;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ name: 'currency_code', length: 3 })
  currencyCode: string;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_code' })
  currency: Currency;

  @Column({ name: 'balance_before', type: 'bigint' })
  balanceBefore: number;

  @Column({ name: 'balance_after', type: 'bigint' })
  balanceAfter: number;

  @Column({ default: PROCESS_STATUSES.PENDING })
  status: ProcessStatus;

  @Column({
    name: 'idempotency_key',
    type: 'varchar',
    nullable: true,
    unique: true,
  })
  idempotencyKey: string | null;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;
}
