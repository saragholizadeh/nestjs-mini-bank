import { Module } from '@nestjs/common';
import { DepositModule } from './deposit/deposit.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { TransferModule } from './transfer/transfer.module';

@Module({
  imports: [DepositModule, WithdrawModule, TransferModule],
})
export class TransactionModule {}
