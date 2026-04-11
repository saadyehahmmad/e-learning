import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsIn,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class PatchPlacementQuestionDto {
  @ApiPropertyOptional({ enum: ['single', 'multi', 'text'] })
  @IsOptional()
  @IsString()
  @IsIn(['single', 'multi', 'text'])
  type?: 'single' | 'multi' | 'text';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  prompt?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MinLength(1)
  correctAnswer?: string;
}
