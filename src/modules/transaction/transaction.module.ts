import { Module } from '@nestjs/common';
import { DepositModule } from './deposit/deposit.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { TransferModule } from './transfer/transfer.module';
import { DatabaseModule } from 'src/infrastructure/database/database.module';
import { TransactionController } from './transaction.controller';
import { TransactionQueryService } from './transaction-query.service';

@Module({
  imports: [DepositModule, WithdrawModule, TransferModule, DatabaseModule],
  controllers: [TransactionController],
  providers: [TransactionQueryService],
})
export class TransactionModule {}
