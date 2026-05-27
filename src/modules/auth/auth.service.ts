import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataSource, EntityManager, QueryFailedError } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRepository } from 'src/infrastructure/database/repositories/user.repository';
import { AccountRepository } from 'src/infrastructure/database/repositories/account.repository';
import { ACCOUNT_DEFAULTS } from 'src/common/constants/account.constants';
import {
  ACCOUNT_NUMBER_RULES,
  AUTH_DEFAULTS,
} from 'src/common/constants/runtime.constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly userRepo: UserRepository,
    private readonly accountRepo: AccountRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      return await this.dataSource.transaction(
        async (manager: EntityManager) => {
          const exists = await this.userRepo.existsByEmail(dto.email, manager);
          if (exists) throw new ConflictException('Email already in use');

          const passwordHash = await bcrypt.hash(
            dto.password,
            AUTH_DEFAULTS.BCRYPT_SALT_ROUNDS,
          );

          const user = await this.userRepo.saveWithManager(
            {
              email: dto.email,
              passwordHash,
              fullName: dto.fullName,
            },
            manager,
          );

          const account = await this.accountRepo.saveWithManager(
            {
              userId: user.id,
              accountNumber: this.generateAccountNumber(),
              currencyCode: ACCOUNT_DEFAULTS.CURRENCY_CODE,
              balance: ACCOUNT_DEFAULTS.INITIAL_BALANCE,
            },
            manager,
          );

          return {
            message: 'Registration successful',
            data: {
              userId: user.id,
              accountId: account.id,
            },
          };
        },
      );
    } catch (error) {
      this.handleRegisterError(error);
    }
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo.findActiveByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

    const token = this.jwtService.sign({ sub: user.id, email: user.email });
    return {
      message: 'Login successful',
      data: { accessToken: token },
    };
  }

  private generateAccountNumber(): string {
    return Date.now()
      .toString()
      .slice(-ACCOUNT_NUMBER_RULES.LENGTH)
      .padStart(ACCOUNT_NUMBER_RULES.LENGTH, ACCOUNT_NUMBER_RULES.PAD_CHAR);
  }

  private handleRegisterError(error: unknown): never {
    if (error instanceof ConflictException) {
      throw error;
    }

    if (error instanceof QueryFailedError) {
      const driverError = error.driverError as {
        code?: string;
        constraint?: string;
      };

      if (driverError.code === '23505') {
        if (driverError.constraint?.includes('email')) {
          throw new ConflictException('Email already in use');
        }

        if (driverError.constraint?.includes('account_number')) {
          throw new ConflictException('Account number already exists');
        }

        throw new ConflictException('Duplicate record already exists');
      }
    }

    throw error;
  }
}
