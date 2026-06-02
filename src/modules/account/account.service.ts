import { ForbiddenException, Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/infrastructure/database/repositories/account.repository';
import {
  AccountBalanceResponseDto,
  MyAccountsResponseDto,
} from './dto/account-response.dto';

@Injectable()
export class AccountService {
  constructor(private readonly accountRepo: AccountRepository) {}

  async getMyAccounts(userId: string): Promise<MyAccountsResponseDto> {
    const accounts = await this.accountRepo.findByUserId(userId);

    return {
      accounts: accounts.map((account) => ({
        id: account.id,
        accountNumber: account.accountNumber,
        currencyCode: account.currencyCode,
        status: account.status,
      })),
    };
  }

  async getMyAccountBalance(
    userId: string,
    accountId: string,
  ): Promise<AccountBalanceResponseDto> {
    const account = await this.accountRepo.findById(accountId);

    if (!account || account.userId !== userId) {
      throw new ForbiddenException('Account does not belong to you');
    }

    return {
      accountId: account.id,
      balance: account.balance,
      currencyCode: account.currencyCode,
    };
  }
}
