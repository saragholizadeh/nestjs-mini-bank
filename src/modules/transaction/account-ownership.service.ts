import { ForbiddenException, Injectable } from '@nestjs/common';
import { AccountRepository } from '../../infrastructure/database/repositories/account.repository';

@Injectable()
export class AccountOwnershipService {
  constructor(private readonly accountRepo: AccountRepository) {}

  async assertOwner(userId: string, accountId: string): Promise<void> {
    const account = await this.accountRepo.findById(accountId);

    if (!account || account.userId !== userId) {
      throw new ForbiddenException('Account does not belong to you');
    }
  }
}
