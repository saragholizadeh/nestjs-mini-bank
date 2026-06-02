import { Module } from '@nestjs/common';
import { DepositService } from './deposit.service';
import { DepositController } from './deposit.controller';
import { BankingCoreModule } from 'src/domain/banking-core/banking-core.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, BankingCoreModule],
  controllers: [DepositController],
  providers: [DepositService],
})
export class DepositModule {}
