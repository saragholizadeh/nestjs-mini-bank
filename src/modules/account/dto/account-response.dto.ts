import { ApiProperty } from '@nestjs/swagger';

export class AccountSummaryDto {
  @ApiProperty({
    example: 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111',
  })
  id: string;

  @ApiProperty({
    example: '1234567890',
  })
  accountNumber: string;

  @ApiProperty({
    example: 'USD',
  })
  currencyCode: string;

  @ApiProperty({
    example: 'active',
  })
  status: string;
}

export class MyAccountsResponseDto {
  @ApiProperty({
    type: [AccountSummaryDto],
  })
  accounts: AccountSummaryDto[];
}

export class AccountBalanceResponseDto {
  @ApiProperty({
    example: 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111',
  })
  accountId: string;

  @ApiProperty({
    example: 50000,
    description: 'Balance in the smallest currency unit.',
  })
  balance: number;

  @ApiProperty({
    example: 'USD',
  })
  currencyCode: string;
}
