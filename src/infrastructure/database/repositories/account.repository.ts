import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly repo: Repository<Account>,
  ) {}

  async findById(id: string): Promise<Account | null> {
    return this.repo.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findByUserId(userId: string): Promise<Account[]> {
    return this.repo.find({
      where: { userId, deletedAt: IsNull() },
    });
  }

  async findByAccountNumber(accountNumber: string): Promise<Account | null> {
    return this.repo.findOne({
      where: { accountNumber, deletedAt: IsNull() },
    });
  }

  // used by AccountLockManager — must be called inside a transaction
  async findByIdWithLock(
    id: string,
    manager: EntityManager,
  ): Promise<Account | null> {
    return manager.findOne(Account, {
      where: { id, deletedAt: IsNull() },
      lock: { mode: 'pessimistic_write' },
    });
  }

  async save(account: Partial<Account>): Promise<Account> {
    return this.repo.save(account);
  }

  async saveWithManager(
    account: Partial<Account>,
    manager: EntityManager,
  ): Promise<Account> {
    return manager.save(Account, account);
  }
}
