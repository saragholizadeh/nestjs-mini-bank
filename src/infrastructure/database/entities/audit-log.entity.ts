import { Column, Entity } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'user_id', nullable: true })
  userId?: string;

  @Column()
  action: string; // DEPOSIT | WITHDRAWAL | TRANSFER | LOGIN | LOGIN_FAILED

  @Column({ name: 'entity_type', nullable: true })
  entityType?: string; // account | user

  @Column({ name: 'entity_id', nullable: true })
  entityId?: string;

  @Column({ type: 'jsonb', nullable: true })
  before?: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  after?: Record<string, any>;

  @Column({ name: 'ip_address', nullable: true })
  ipAddress?: string;

  @Column({ name: 'user_agent', nullable: true })
  userAgent?: string;

  @Column()
  result: string; // SUCCESS | FAILED

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;
}
