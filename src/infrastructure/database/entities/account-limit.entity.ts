import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Account } from './account.entity';

@Entity('account_limits')
export class AccountLimit extends BaseEntity {
  @Column({ name: 'account_id' })
  accountId: string;

  @ManyToOne(() => Account, (account) => account.limits)
  @JoinColumn({ name: 'account_id' })
  account: Account;

  @Column({ name: 'limit_type' })
  limitType: string; // daily_withdrawal | max_transfer | tx_count_per_day

  @Column({ type: 'bigint' })
  amount: number;

  @Column()
  period: string; // daily | monthly | per_transaction
}
