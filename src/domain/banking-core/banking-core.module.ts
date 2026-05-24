import { Module } from '@nestjs/common';
import { BankingCoreService } from './banking-core.service';
import { BankingCoreController } from './banking-core.controller';

@Module({
  controllers: [BankingCoreController],
  providers: [BankingCoreService],
})
export class BankingCoreModule {}
