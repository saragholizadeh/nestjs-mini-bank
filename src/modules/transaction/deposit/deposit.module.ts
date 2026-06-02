import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { BankingCoreModule } from 'src/domain/banking-core/banking-core.module';
import { TransactionAccessModule } from '../transaction-access.module';

@Module({
  imports: [TransactionAccessModule, BankingCoreModule],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
