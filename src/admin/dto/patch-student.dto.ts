import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class PatchStudentDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({ enum: ['active', 'inactive'] })
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: 'active' | 'inactive';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  groupId?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  nextPaymentDate?: string | null;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  nextPaymentAmount?: number | null;
}
