import { Module } from '@nestjs/common';
import { DepositModule } from './deposit/deposit.module';
import { TransferModule } from './transfer/transfer.module';
import { WithdrawModule } from './withdraw/withdraw.module';

@Module({
  imports: [DepositModule, TransferModule, WithdrawModule],
})
export class TransactionModule {}
