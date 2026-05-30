import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Account } from '../../infrastructure/database/entities/account.entity';

@Injectable()
export class BalanceValidator {
  validateAccountActive(account: Account): void {
    if (account.status !== 'active') {
      throw new BadRequestException(
        `Account ${account.accountNumber} is ${account.status}`,
      );
    }
  }

  validateSufficientBalance(account: Account, amount: number): void {
    if (account.balance < amount) {
      throw new UnprocessableEntityException(
        `Insufficient funds - available: ${account.balance}, required: ${amount}`,
      );
    }
  }

  validateAmount(amount: number): void {
    if (!Number.isInteger(amount) || amount <= 0) {
      throw new BadRequestException(
        'Amount must be a positive integer in smallest currency unit',
      );
    }
  }

  validateTransfer(from: Account, to: Account, amount: number): void {
    this.validateAmount(amount);
    this.validateAccountActive(from);
    this.validateAccountActive(to);
    this.validateSufficientBalance(from, amount);

    if (from.id === to.id) {
      throw new BadRequestException('Cannot transfer to the same account');
    }
  }

  validateDebit(account: Account, amount: number): void {
    this.validateAmount(amount);
    this.validateAccountActive(account);
    this.validateSufficientBalance(account, amount);
  }

  validateCredit(account: Account, amount: number): void {
    this.validateAmount(amount);
    this.validateAccountActive(account);
  }
}
