import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateMyPaymentDto {
  @ApiProperty({
    example: 'd8b9a3b8-8dba-4e7e-a4c8-fcd46b0575ec',
  })
  @IsString()
  @IsNotEmpty()
  enrollmentId: string;

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
