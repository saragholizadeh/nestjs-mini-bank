import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, IsNull, Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.repo.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findActiveById(id: string): Promise<User | null> {
    return this.repo.findOne({
      where: { id, isActive: true, deletedAt: IsNull() },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email },
    });
  }

  async findActiveByEmail(email: string): Promise<User | null> {
    return this.repo.findOne({
      where: { email, isActive: true, deletedAt: IsNull() },
    });
  }

  async existsByEmail(
    email: string,
    manager?: EntityManager,
  ): Promise<boolean> {
    const repository = manager?.getRepository(User) ?? this.repo;
    return repository.exists({ where: { email } });
  }

  async save(user: Partial<User>): Promise<User> {
    return this.repo.save(user);
  }

  async saveWithManager(
    user: Partial<User>,
    manager: EntityManager,
  ): Promise<User> {
    return manager.save(User, user);
  }
}
