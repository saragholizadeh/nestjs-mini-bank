import { Injectable } from '@nestjs/common';
import { LedgerService } from '../../../domain/banking-core/banking-core.service';
import { TransferDto } from '../dto/transaction.dto';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { AccountOwnershipService } from '../account-ownership.service';

@Injectable()
export class TransferService {
  constructor(
    private readonly ledger: LedgerService,
    private readonly accountOwnership: AccountOwnershipService,
  ) {}

  async transfer(
    user: User,
    dto: TransferDto,
    ip: string | null,
  ): Promise<{ message: string; transferLogId: string }> {
    await this.accountOwnership.assertOwner(user.id, dto.fromAccountId);

    const result = await this.ledger.transfer(
      dto.fromAccountId,
      dto.toAccountId,
      dto.amount,
      {
        idempotencyKey: dto.idempotencyKey,
        userId: user.id,
        ipAddress: ip,
      },
    );

    return {
      message: 'Transfer successful',
      transferLogId: result.transferLogId,
    };
  }
}
