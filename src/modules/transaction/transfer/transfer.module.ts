import { Module } from '@nestjs/common';
import { BankingCoreModule } from '../../../domain/banking-core/banking-core.module';
import { TransactionAccessModule } from '../transaction-access.module';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
  imports: [BankingCoreModule, TransactionAccessModule],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
