import { Module } from '@nestjs/common';
import { LedgerService } from './banking-core.service';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TransactionRecorder } from './transaction.recorder';
import { AccountLockManager } from './account-lock.manager';
import { BalanceValidator } from './balance.validator';

@Module({
  imports: [DatabaseModule],
  providers: [
    LedgerService,
    AccountLockManager,
    BalanceValidator,
    TransactionRecorder,
  ],
})
export class BankingCoreModule {}
