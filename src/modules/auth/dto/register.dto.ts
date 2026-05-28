import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    example: 'sara@example.com',
    description: 'Unique email address used for authentication.',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Secret123!',
    minLength: 8,
    format: 'password',
    description: 'Plain-text password that will be hashed server-side.',
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({
    example: 'Sara Ahmadi',
    description: 'Display name of the customer.',
  })
  @IsString()
  fullName: string;
}
