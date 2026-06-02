import { ForbiddenException, Injectable } from '@nestjs/common';
import { LedgerService } from '../../../domain/banking-core/banking-core.service';
import { AccountRepository } from '../../../infrastructure/database/repositories/account.repository';
import { TransferDto } from '../dto/transaction.dto';
import { User } from '../../../infrastructure/database/entities/user.entity';

@Injectable()
export class TransferService {
  constructor(
    private readonly ledger: LedgerService,
    private readonly accountRepo: AccountRepository,
  ) {}

  async transfer(
    user: User,
    dto: TransferDto,
  ): Promise<{ message: string; transferLogId: string }> {
    await this.assertAccountOwnership(user.id, dto.fromAccountId);

    const result = await this.ledger.transfer(
      dto.fromAccountId,
      dto.toAccountId,
      dto.amount,
      { idempotencyKey: dto.idempotencyKey },
    );

    return {
      message: 'Transfer successful',
      transferLogId: result.transferLogId,
    };
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
