import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { BankingCoreModule } from './domain/banking-core/banking-core.module';
import { AccountModule } from './modules/account/account.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AuditModule } from './infrastructure/audit/audit.module';
import { QueueModule } from './infrastructure/queue/queue.module';

@Module({
  imports: [AuthModule, BankingCoreModule, AccountModule, TransactionModule, AuditModule, QueueModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
