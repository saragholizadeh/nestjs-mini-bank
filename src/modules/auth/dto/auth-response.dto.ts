import { ApiProperty } from '@nestjs/swagger';

export class RegisterResponseDto {
  @ApiProperty({
    example: '55d4b4bf-1b24-4c3c-8d89-2e1b8d9b78da',
  })
  userId: string;

  @ApiProperty({
    example: 'f4f5cc5f-25a5-4f0e-b6a8-bf1b645cb111',
  })
  accountId: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1NWQ0YjRiZi0xYjI0LTRjM2MtOGQ4OS0yZTFiOGQ5Yjc4ZGEiLCJlbWFpbCI6InNhcmFAZXhhbXBsZS5jb20ifQ.signature',
  })
  accessToken: string;
}

export class MeResponseDto {
  @ApiProperty({
    example: '55d4b4bf-1b24-4c3c-8d89-2e1b8d9b78da',
  })
  id: string;

  @ApiProperty({
    example: 'sara@example.com',
  })
  email: string;

  @ApiProperty({
    example: 'Sara Ahmadi',
  })
  fullName: string;

  @ApiProperty({
    example: true,
  })
  isActive: boolean;
}
