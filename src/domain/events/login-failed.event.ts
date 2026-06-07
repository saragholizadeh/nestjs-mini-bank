export class LoginFailedEvent {
  constructor(
    public readonly email: string,
    public readonly ipAddress: string | null,
    public readonly occurredAt: Date,
  ) {}
}
