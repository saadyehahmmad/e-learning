import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateStudentDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty({ enum: ['active', 'inactive'] })
  @IsIn(['active', 'inactive'])
  status: 'active' | 'inactive';

  @ApiPropertyOptional({ description: 'Group id `g_<uuid>`' })
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

  @ApiPropertyOptional({
    description: 'Optional initial password for the student account',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;
}
