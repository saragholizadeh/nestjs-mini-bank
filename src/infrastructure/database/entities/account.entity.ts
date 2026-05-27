import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Currency } from './currency.entity';
import { AccountLimit } from './account-limit.entity';
import { Transaction } from './transaction.entity';

@Entity('accounts')
export class Account extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'account_number', unique: true })
  accountNumber: string;

  @Column({ type: 'bigint', default: 0 })
  balance: number;

  @Column({ name: 'currency_code', length: 3, default: 'USD' })
  currencyCode: string;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_code' })
  currency: Currency;

  @Column({ default: 'active' })
  status: string; // active | frozen | closed

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Transaction, (tx) => tx.account)
  transactions: Transaction[];

  @OneToMany(() => AccountLimit, (limit) => limit.account)
  limits: AccountLimit[];
}
