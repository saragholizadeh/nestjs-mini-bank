import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EVENTS } from '../../domain/events/event-names';
import { TransferCompletedEvent } from '../../domain/events';
import {
  TRANSFER_QUEUE,
  TRANSFER_COMPLETED_JOB,
  TransferCompletedJobPayload,
} from './jobs/transfer.job';

@Injectable()
export class QueueListener {
  private readonly logger = new Logger(QueueListener.name);

  constructor(
    @InjectQueue(TRANSFER_QUEUE)
    private readonly transferQueue: Queue,
  ) {}

  @OnEvent(EVENTS.TRANSFER_COMPLETED)
  async handleTransferCompleted(event: TransferCompletedEvent): Promise<void> {
    const payload: TransferCompletedJobPayload = {
      transferLogId: event.transferLogId,
      userId: event.userId,
      fromAccountId: event.fromAccountId,
      toAccountId: event.toAccountId,
      amount: event.amount,
      idempotencyKey: event.idempotencyKey,
      occurredAt: event.occurredAt.toISOString(),
    };

    await this.transferQueue.add(TRANSFER_COMPLETED_JOB, payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000, // 2s → 4s → 8s
      },
      removeOnComplete: 100, // keep last 100 completed jobs in Redis
      removeOnFail: 200, // keep last 200 failed jobs for inspection
    });

    this.logger.log(`Job queued for transferLogId: ${event.transferLogId}`);
  }
}
