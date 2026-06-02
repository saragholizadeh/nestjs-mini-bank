import { Injectable } from '@nestjs/common';
import { LedgerService } from '../../../domain/banking-core/banking-core.service';
import { WithdrawDto } from '../dto/transaction.dto';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { AccountOwnershipService } from '../account-ownership.service';

@Injectable()
export class WithdrawService {
  constructor(
    private readonly ledger: LedgerService,
    private readonly accountOwnership: AccountOwnershipService,
  ) {}

  async withdraw(user: User, dto: WithdrawDto): Promise<{ message: string }> {
    await this.accountOwnership.assertOwner(user.id, dto.accountId);

    await this.ledger.debit(dto.accountId, dto.amount, {
      idempotencyKey: dto.idempotencyKey,
    });

    return { message: 'Withdrawal successful' };
  }
}
