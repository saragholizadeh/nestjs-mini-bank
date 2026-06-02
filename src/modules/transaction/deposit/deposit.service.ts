import { Injectable, ForbiddenException } from '@nestjs/common';
import { LedgerService } from '../../../domain/banking-core/banking-core.service';
import { AccountRepository } from '../../../infrastructure/database/repositories/account.repository';
import { DepositDto } from '../dto/transaction.dto';
import { User } from '../../../infrastructure/database/entities/user.entity';

@Injectable()
export class DepositService {
  constructor(
    private readonly ledger: LedgerService,
    private readonly accountRepo: AccountRepository,
  ) {}

  async deposit(user: User, dto: DepositDto): Promise<{ message: string }> {
    await this.assertAccountOwnership(user.id, dto.accountId);

    await this.ledger.credit(dto.accountId, dto.amount, {
      idempotencyKey: dto.idempotencyKey,
    });

    return { message: 'Deposit successful' };
  }

  // user can only deposit into their own account
  private async assertAccountOwnership(
    userId: string,
    accountId: string,
  ): Promise<void> {
    const account = await this.accountRepo.findById(accountId);
    if (!account || account.userId !== userId) {
      throw new ForbiddenException('Account does not belong to you');
    }
  }
}
