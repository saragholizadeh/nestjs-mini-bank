import { ApiProperty } from '@nestjs/swagger';

export class TransferResponseDto {
  @ApiProperty({
    example: 'b8f7f52d-7f27-4f8b-8a9d-f8b7d9c20f31',
    description: 'Identifier of the completed transfer log.',
  })
  transferLogId: string;
}

export class TransactionItemDto {
  @ApiProperty({
    example: '5f84f828-f42c-4844-aac9-e5cf08e0d5de',
  })
  id: string;

  @ApiProperty({
    example: 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111',
  })
  accountId: string;

  @ApiProperty({
    example: 'deposit',
  })
  type: string;

  @ApiProperty({
    example: 50000,
    description: 'Amount in the smallest currency unit.',
  })
  amount: number;

  @ApiProperty({
    example: 'USD',
  })
  currencyCode: string;

  @ApiProperty({
    example: 0,
  })
  balanceBefore: number;

  @ApiProperty({
    example: 50000,
  })
  balanceAfter: number;

  @ApiProperty({
    example: 'completed',
  })
  status: string;

  @ApiProperty({
    example: 'b8f7f52d-7f27-4f8b-8a9d-f8b7d9c20f31',
    nullable: true,
  })
  referenceId: string | null;

  @ApiProperty({
    example: 'deposit-2026-06-02-001',
    nullable: true,
  })
  idempotencyKey: string | null;

  @ApiProperty({
    example: '2026-06-02T10:30:00.000Z',
  })
  createdAt: Date;
}

export class TransactionHistoryMetaDto {
  @ApiProperty({
    example: 1,
  })
  page: number;

  @ApiProperty({
    example: 20,
  })
  limit: number;

  @ApiProperty({
    example: 42,
  })
  total: number;

  @ApiProperty({
    example: 3,
  })
  totalPages: number;
}

export class TransactionHistoryResponseDto {
  @ApiProperty({
    type: [TransactionItemDto],
  })
  transactions: TransactionItemDto[];

  @ApiProperty({
    type: TransactionHistoryMetaDto,
  })
  meta: TransactionHistoryMetaDto;
}

export class TransactionReceiptResponseDto extends TransactionItemDto {}
