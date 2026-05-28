import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'sara@example.com',
    description: 'Registered email address.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Secret123!',
    format: 'password',
    description: 'Password for the account.',
  })
  @IsString()
  password: string;
}
