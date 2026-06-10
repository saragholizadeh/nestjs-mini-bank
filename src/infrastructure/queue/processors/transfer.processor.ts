import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import {
  TRANSFER_QUEUE,
  TRANSFER_COMPLETED_JOB,
  TransferCompletedJobPayload,
} from '../jobs/transfer.job';

const FRAUD_THRESHOLD = 10_000_00; // $10,000 in cents

@Processor(TRANSFER_QUEUE)
export class TransferProcessor extends WorkerHost {
  private readonly logger = new Logger(TransferProcessor.name);

  // BullMQ calls this automatically when a job arrives
  async process(job: Job<TransferCompletedJobPayload>): Promise<void> {
    this.logger.log(
      `Picked up job — id: ${job.id}, attempt: ${job.attemptsMade + 1}`,
    );

    switch (job.name) {
      case TRANSFER_COMPLETED_JOB:
        await this.handleTransferCompleted(job.data);
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  // ─── Step A: Notification ────────────────────────────────────────
  private async sendNotification(
    payload: TransferCompletedJobPayload,
  ): Promise<void> {
    // In production: call email / SMS / push notification service
    // Simulated here with a log
    this.logger.log(
      `[NOTIFICATION] Transfer of ${payload.amount} cents completed — ` +
        `notifying userId: ${payload.userId}`,
    );
  }

  // ─── Step B: Fraud check ─────────────────────────────────────────
  private async checkFraud(
    payload: TransferCompletedJobPayload,
  ): Promise<void> {
    if (payload.amount >= FRAUD_THRESHOLD) {
      // In production: call fraud detection service, freeze account, alert team
      this.logger.warn(
        `[FRAUD] ⚠️  Large transfer flagged — ` +
          `amount: ${payload.amount} cents, ` +
          `from: ${payload.fromAccountId}, ` +
          `to: ${payload.toAccountId}`,
      );
    } else {
      this.logger.log(
        `[FRAUD] ✓ Transfer cleared — ` +
          `transferLogId: ${payload.transferLogId}`,
      );
    }
  }

  // ─── Main handler ────────────────────────────────────────────────
  private async handleTransferCompleted(
    payload: TransferCompletedJobPayload,
  ): Promise<void> {
    await this.sendNotification(payload);
    await this.checkFraud(payload);

    this.logger.log(`Job done — transferLogId: ${payload.transferLogId}`);
  }
}
