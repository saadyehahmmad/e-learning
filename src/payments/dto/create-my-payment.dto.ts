import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMyPaymentDto {
  @ApiProperty({
    example: 99.99,
  })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'USD',
  })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiPropertyOptional({
    example: 'ch_3QwYvY2eZvKYlo2C1x2y3z4A',
  })
  @IsOptional()
  @IsString()
  providerReference?: string;
}
