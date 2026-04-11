import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsString, MinLength } from 'class-validator';

export class CreatePlacementQuestionDto {
  @ApiProperty({ enum: ['single', 'multi', 'text'] })
  @IsString()
  @IsIn(['single', 'multi', 'text'])
  type: 'single' | 'multi' | 'text';

  @ApiProperty()
  @IsString()
  @MinLength(1)
  prompt: string;

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  options: string[];

  @ApiProperty()
  @IsString()
  @MinLength(1)
  correctAnswer: string;
}
