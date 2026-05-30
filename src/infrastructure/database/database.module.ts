import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Account } from './entities/account.entity';
import { Transaction } from './entities/transaction.entity';
import { TransferLog } from './entities/transfer-log.entity';
import { AuditLog } from './entities/audit-log.entity';
import { AccountLimit } from './entities/account-limit.entity';
import { Currency } from './entities/currency.entity';
import { UserRepository } from './repositories/user.repository';
import { AccountRepository } from './repositories/account.repository';
import { TransactionRepository } from './repositories/transaction.repository';
import { TransferLogRepository } from './repositories/transfer-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Account,
      Transaction,
      TransferLog,
      AuditLog,
      AccountLimit,
      Currency,
    ]),
  ],
  providers: [
    UserRepository,
    AccountRepository,
    TransactionRepository,
    TransferLogRepository,
  ],
  exports: [
    UserRepository,
    AccountRepository,
    TransactionRepository,
    TransferLogRepository,
  ],
})
export class DatabaseModule {}
