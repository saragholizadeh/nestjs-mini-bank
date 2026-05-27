import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './account.entity';
import { Currency } from './currency.entity';
import { Transaction } from './transaction.entity';

@Entity('transfer_logs')
export class TransferLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'from_account_id' })
  fromAccountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'from_account_id' })
  fromAccount: Account;

  @Column({ name: 'to_account_id' })
  toAccountId: string;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'to_account_id' })
  toAccount: Account;

  @Column({ type: 'bigint' })
  amount: number;

  @Column({ name: 'currency_code', length: 3 })
  currencyCode: string;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_code' })
  currency: Currency;

  @Column({ default: 'pending' })
  status: string;

  @Column({ name: 'job_id', type: 'varchar', nullable: true })
  jobId: string | null;

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

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date | null;

  @OneToMany(() => Transaction, (tx) => tx.transferLog)
  transactions: Transaction[];
}
