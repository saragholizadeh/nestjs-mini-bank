export const TRANSFER_QUEUE = 'transfer';
export const TRANSFER_COMPLETED_JOB = 'transfer.completed';

export interface TransferCompletedJobPayload {
  transferLogId: string;
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  idempotencyKey: string | null;
  occurredAt: string; // ISO string — dates don't serialize safely in Redis
}
