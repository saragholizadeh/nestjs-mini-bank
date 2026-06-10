import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { BankingCoreModule } from './domain/banking-core/banking-core.module';
import { AccountModule } from './modules/account/account.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { AuditModule } from './infrastructure/audit/audit.module';
import { QueueModule } from './infrastructure/queue/queue.module';
import { LoggerModule } from 'nestjs-pino';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  APP_ENVIRONMENTS,
  DATABASE_DEFAULTS,
} from './common/constants/runtime.constants';
import { EnvironmentConfigModule } from './configs/environment-config.module';
import { EnvironmentConfigService } from './configs/environment-config.service';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    EnvironmentConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [EnvironmentConfigService],
      useFactory: (config: EnvironmentConfigService) => ({
        type: DATABASE_DEFAULTS.DRIVER,
        host: config.database.host,
        port: config.database.port,
        database: config.database.name,
        username: config.database.username,
        password: config.database.password,
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [
          __dirname + '/infrastructure/database/migrations/*{.ts,.js}',
        ],
        synchronize: false,
        logging: config.app.nodeEnv === APP_ENVIRONMENTS.DEVELOPMENT,
      }),
    }),
    LoggerModule.forRootAsync({
      inject: [EnvironmentConfigService],
      useFactory: (config: EnvironmentConfigService) => ({
        pinoHttp:
          config.app.nodeEnv !== APP_ENVIRONMENTS.PRODUCTION
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
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 10,
      ignoreErrors: false,
    }),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        },
      }),
    }),
    QueueModule,
  ],
})
export class AppModule {}
