import { Injectable } from '@nestjs/common';
import { LedgerService } from '../../../domain/banking-core/banking-core.service';
import { DepositDto } from '../dto/transaction.dto';
import { User } from '../../../infrastructure/database/entities/user.entity';
import { AccountOwnershipService } from '../account-ownership.service';

@Injectable()
export class DepositService {
  constructor(
    private readonly ledger: LedgerService,
    private readonly accountOwnership: AccountOwnershipService,
  ) {}

  async deposit(user: User, dto: DepositDto): Promise<{ message: string }> {
    await this.accountOwnership.assertOwner(user.id, dto.accountId);

    await this.ledger.credit(dto.accountId, dto.amount, {
      idempotencyKey: dto.idempotencyKey,
    });

    return { message: 'Deposit successful' };
  }
}
