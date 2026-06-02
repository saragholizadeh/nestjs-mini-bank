import { ApiProperty } from '@nestjs/swagger';

export class TransferResponseDto {
  @ApiProperty({
    example: 'b8f7f52d-7f27-4f8b-8a9d-f8b7d9c20f31',
    description: 'Identifier of the completed transfer log.',
  })
  transferLogId: string;
}
