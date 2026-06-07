export class MoneyWithdrawnEvent {
  constructor(
    public readonly userId: string,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly balanceBefore: number,
    public readonly balanceAfter: number,
    public readonly idempotencyKey: string | null,
    public readonly ipAddress: string | null,
    public readonly occurredAt: Date,
  ) {}
}
