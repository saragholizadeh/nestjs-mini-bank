import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { BankingCoreModule } from './domain/banking-core/banking-core.module';
import { AccountModule } from './modules/account/account.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AuditModule } from './infrastructure/audit/audit.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import appConfig from './configs/app.config';
import databaseConfig from './configs/database.config';
import jwtConfig from './configs/jwt.config';
import {
  APP_ENVIRONMENTS,
  DATABASE_DEFAULTS,
} from './common/constants/runtime.constants';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: DATABASE_DEFAULTS.DRIVER,
        host: config.get('database.host'),
        port: config.get('database.port'),
        database: config.get('database.name'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [
          __dirname + '/infrastructure/database/migrations/*{.ts,.js}',
        ],
        synchronize: false, // never true — always use migrations
        logging:
          config.get<string>('app.nodeEnv') === APP_ENVIRONMENTS.DEVELOPMENT,
      }),
    }),
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp:
          config.get<string>('app.nodeEnv') !== APP_ENVIRONMENTS.PRODUCTION
            ? {
                transport: {
                  target: 'pino-pretty',
                  options: { colorize: true, singleLine: true },
                },
              }
            : undefined,
      }),
    }),
    AuthModule,
    BankingCoreModule,
    AccountModule,
    TransactionModule,
    AuditModule,
    QueueModule,
  ],
})
export class AppModule {}
