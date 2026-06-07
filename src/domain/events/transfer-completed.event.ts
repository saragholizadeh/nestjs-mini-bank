export class TransferCompletedEvent {
  constructor(
    public readonly userId: string,
    public readonly fromAccountId: string,
    public readonly toAccountId: string,
    public readonly transferLogId: string,
    public readonly amount: number,
    public readonly idempotencyKey: string | null,
    public readonly ipAddress: string | null,
    public readonly occurredAt: Date,
  ) {}
}
