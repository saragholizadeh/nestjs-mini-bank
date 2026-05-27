import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Currency } from './currency.entity';
import { AccountLimit } from './account-limit.entity';
import { Transaction } from './transaction.entity';
import {
  ACCOUNT_DEFAULTS,
  ACCOUNT_STATUSES,
} from 'src/common/constants/account.constants';
import type { CurrencyCode } from 'src/common/types/currency.types';
import type { AccountStatus } from 'src/common/types/account.types';

@Entity('accounts')
export class Account extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.accounts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'account_number', unique: true })
  accountNumber: string;

  @Column({ type: 'bigint', default: ACCOUNT_DEFAULTS.INITIAL_BALANCE })
  balance: number;

  @Column({
    name: 'currency_code',
    length: 3,
    default: ACCOUNT_DEFAULTS.CURRENCY_CODE,
  })
  currencyCode: CurrencyCode;

  @ManyToOne(() => Currency)
  @JoinColumn({ name: 'currency_code' })
  currency: Currency;

  @Column({ default: ACCOUNT_STATUSES.ACTIVE })
  status: AccountStatus;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any> | null;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Transaction, (tx) => tx.account)
  transactions: Transaction[];

  @OneToMany(() => AccountLimit, (limit) => limit.account)
  limits: AccountLimit[];
}
