import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueListener } from './queue.listener';
import { TransferProcessor } from './processors/transfer.processor';
import { TRANSFER_QUEUE } from './jobs/transfer.job';

@Module({
  imports: [
    BullModule.registerQueueAsync({
      imports: [ConfigModule],
      name: TRANSFER_QUEUE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.get<string>('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        },
      }),
    }),
  ],
  providers: [QueueListener, TransferProcessor],
})
export class QueueModule {}
