import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PlacementAnswerItemDto {
  @ApiProperty({ example: '3f8d44d5-10b1-4e13-b41e-2ddf4a9f1d31' })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ example: 'present perfect' })
  @IsString()
  @IsNotEmpty()
  answer: string;
}

/**
 * Body for submitting placement answers (batch).
 */
export class SubmitPlacementAnswersDto {
  @ApiProperty({
    type: () => [PlacementAnswerItemDto],
    description: 'Answers keyed by question id',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PlacementAnswerItemDto)
  answers: PlacementAnswerItemDto[];
}
