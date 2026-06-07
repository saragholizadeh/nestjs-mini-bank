export class TransferFailedEvent {
  constructor(
    public readonly userId: string,
    public readonly fromAccountId: string,
    public readonly toAccountId: string,
    public readonly amount: number,
    public readonly reason: string,
    public readonly ipAddress: string | null,
    public readonly occurredAt: Date,
  ) {}
}
