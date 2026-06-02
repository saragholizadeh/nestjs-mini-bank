import { ForbiddenException, Injectable } from '@nestjs/common';
import { LedgerService } from '../../../domain/banking-core/banking-core.service';
import { AccountRepository } from '../../../infrastructure/database/repositories/account.repository';
import { WithdrawDto } from '../dto/transaction.dto';
import { User } from '../../../infrastructure/database/entities/user.entity';

@Injectable()
export class WithdrawService {
  constructor(
    private readonly ledger: LedgerService,
    private readonly accountRepo: AccountRepository,
  ) {}

  async withdraw(user: User, dto: WithdrawDto): Promise<{ message: string }> {
    await this.assertAccountOwnership(user.id, dto.accountId);

    await this.ledger.debit(dto.accountId, dto.amount, {
      idempotencyKey: dto.idempotencyKey,
    });

    return { message: 'Withdrawal successful' };
  }

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
