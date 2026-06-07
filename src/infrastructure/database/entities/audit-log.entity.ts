import { Column, Entity } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @Column({ primary: true, generated: 'uuid' })
  id: string;

  @Column({ name: 'user_id', type: 'uuid', nullable: true })
  userId: string | null;

  @Column()
  action: string; // DEPOSIT | WITHDRAWAL | TRANSFER | LOGIN | LOGIN_FAILED

  @Column({ name: 'entity_type', type: 'varchar', nullable: true })
  entityType: string | null; // account | user

  @Column({ name: 'entity_id', type: 'uuid', nullable: true })
  entityId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  before: Record<string, any> | null;

  @Column({ type: 'jsonb', nullable: true })
  after: Record<string, any> | null;

  @Column({ name: 'ip_address', type: 'varchar', nullable: true })
  ipAddress: string | null;

  @Column({ name: 'user_agent', type: 'varchar', nullable: true })
  userAgent: string | null;

  @Column()
  result: string; // SUCCESS | FAILED

  @Column({ name: 'created_at', type: 'timestamp', default: () => 'NOW()' })
  createdAt: Date;
}
