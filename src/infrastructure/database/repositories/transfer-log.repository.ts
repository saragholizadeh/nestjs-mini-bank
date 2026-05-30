import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { TransferLog } from '../entities/transfer-log.entity';

@Injectable()
export class TransferLogRepository {
  constructor(
    @InjectRepository(TransferLog)
    private readonly repo: Repository<TransferLog>,
  ) {}

  async findByIdempotencyKey(key: string): Promise<TransferLog | null> {
    return this.repo.findOne({ where: { idempotencyKey: key } });
  }

  async saveWithManager(
    data: Partial<TransferLog>,
    manager: EntityManager,
  ): Promise<TransferLog> {
    return manager.save(TransferLog, data);
  }

  async updateStatusWithManager(
    id: string,
    status: TransferLog['status'],
    manager: EntityManager,
  ): Promise<void> {
    await manager.update(TransferLog, id, {
      status,
      completedAt: status === 'completed' ? new Date() : null,
    });
  }
}
