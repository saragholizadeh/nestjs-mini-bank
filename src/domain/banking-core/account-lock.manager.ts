import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { Account } from '../../infrastructure/database/entities/account.entity';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';

@Injectable()
export class AccountLockManager {
  constructor(private readonly accountRepo: AccountRepository) {}

  async lock(accountId: string, manager: EntityManager): Promise<Account> {
    const account = await this.accountRepo.findByIdWithLock(accountId, manager);

    if (!account) {
      throw new NotFoundException(`Account ${accountId} not found`);
    }

    return account;
  }

  // transfer needs both accounts locked in a fixed order
  // always lock the lower UUID first, prevents deadlocks

  async lockTwo(
    firstId: string,
    secondId: string,
    manager: EntityManager,
  ): Promise<[Account, Account]> {
    const [idA, idB] = [firstId, secondId].sort();

    const accountA = await this.lock(idA, manager);
    const accountB = await this.lock(idB, manager);

    // return in original caller order, not sorted order
    return firstId === idA ? [accountA, accountB] : [accountB, accountA];
  }
}
