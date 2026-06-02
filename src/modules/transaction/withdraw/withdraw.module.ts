import { Module } from '@nestjs/common';
import { BankingCoreModule } from '../../../domain/banking-core/banking-core.module';
import { TransactionAccessModule } from '../transaction-access.module';
import { WithdrawController } from './withdraw.controller';
import { WithdrawService } from './withdraw.service';

@Module({
  imports: [BankingCoreModule, TransactionAccessModule],
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule {}
