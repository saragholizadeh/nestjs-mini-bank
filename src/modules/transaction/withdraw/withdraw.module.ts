import { Module } from '@nestjs/common';
import { BankingCoreModule } from '../../../domain/banking-core/banking-core.module';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { WithdrawController } from './withdraw.controller';
import { WithdrawService } from './withdraw.service';

@Module({
  imports: [BankingCoreModule, DatabaseModule],
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule {}
