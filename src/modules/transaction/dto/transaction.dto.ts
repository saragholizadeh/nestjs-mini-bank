import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsPositive,
  IsString,
  IsUUID,
  IsOptional,
} from 'class-validator';

export class DepositDto {
  @ApiProperty({
    example: 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111',
    description: 'Account that receives the deposit.',
  })
  @IsUUID()
  accountId: string;

  @ApiProperty({
    example: 50000,
    description: 'Amount in the smallest currency unit.',
  })
  @IsInt()
  @IsPositive()
  amount: number; // in smallest unit — cents, tomans, etc.

  @ApiPropertyOptional({
    example: 'deposit-2026-06-02-001',
    description: 'Optional client-generated key to prevent duplicate requests.',
  })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}

export class WithdrawDto {
  @ApiProperty({
    example: 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111',
    description: 'Account that funds will be withdrawn from.',
  })
  @IsUUID()
  accountId: string;

  @ApiProperty({
    example: 25000,
    description: 'Amount in the smallest currency unit.',
  })
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({
    example: 'withdraw-2026-06-02-001',
    description: 'Optional client-generated key to prevent duplicate requests.',
  })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}

export class TransferDto {
  @ApiProperty({
    example: 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111',
    description: 'Owned account that sends the funds.',
  })
  @IsUUID()
  fromAccountId: string;

  @ApiProperty({
    example: '0b4da946-5cd8-46d2-9269-f9421f57d2c1',
    description: 'Destination account that receives the funds.',
  })
  @IsUUID()
  toAccountId: string;

  @ApiProperty({
    example: 10000,
    description: 'Amount in the smallest currency unit.',
  })
  @IsInt()
  @IsPositive()
  amount: number;

  @ApiPropertyOptional({
    example: 'transfer-2026-06-02-001',
    description: 'Optional client-generated key to prevent duplicate requests.',
  })
  @IsString()
  @IsOptional()
  idempotencyKey?: string;
}
