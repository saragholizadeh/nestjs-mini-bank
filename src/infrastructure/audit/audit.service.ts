import { Injectable } from '@nestjs/common';
import { AuditLogRepository } from '../database/repositories/audit-log.repository';

export interface AuditEntry {
  userId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  before: Record<string, any> | null;
  after: Record<string, any> | null;
  ipAddress: string | null;
  result: 'SUCCESS' | 'FAILED';
}

@Injectable()
export class AuditService {
  constructor(private readonly auditLogRepo: AuditLogRepository) {}

  async log(entry: AuditEntry): Promise<void> {
    await this.auditLogRepo.record({
      ...entry,
      userAgent: null,
    });
  }
}