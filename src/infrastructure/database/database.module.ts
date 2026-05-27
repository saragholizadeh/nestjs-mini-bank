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
  providers: [UserRepository, AccountRepository],
  exports: [UserRepository, AccountRepository],
})
export class DatabaseModule {}
