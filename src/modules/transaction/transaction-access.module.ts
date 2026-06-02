import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../infrastructure/database/database.module';
import { AccountOwnershipService } from './account-ownership.service';

@Module({
  imports: [DatabaseModule],
  providers: [AccountOwnershipService],
  exports: [AccountOwnershipService],
})
export class TransactionAccessModule {}
