import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class SubmitQuizAnswerDto {
  @ApiProperty({ example: '3f8d44d5-10b1-4e13-b41e-2ddf4a9f1d31' })
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @ApiProperty({ example: 'present perfect' })
  @IsString()
  @IsNotEmpty()
  answer: string;
}

export class SubmitQuizDto {
  @ApiProperty({
    type: () => [SubmitQuizAnswerDto],
    description: 'Answers keyed by quiz question id',
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubmitQuizAnswerDto)
  answers: SubmitQuizAnswerDto[];
}
