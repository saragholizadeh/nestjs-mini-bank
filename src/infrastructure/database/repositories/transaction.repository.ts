import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repo: Repository<Transaction>,
  ) {}

  async findByAccountId(
    accountId: string,
    limit = 20,
    offset = 0,
  ): Promise<Transaction[]> {
    return this.repo.find({
      where: { accountId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async findByIdempotencyKey(key: string): Promise<Transaction | null> {
    return this.repo.findOne({ where: { idempotencyKey: key } });
  }

  async saveWithManager(
    data: Partial<Transaction>,
    manager: EntityManager,
  ): Promise<Transaction> {
    return manager.save(Transaction, data);
  }
}
