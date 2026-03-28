import { QuizDto } from '../../quizzes/dto/quiz.dto';

import {
  // decorators here
  Type,
} from 'class-transformer';

import {
  // decorators here

  ValidateNested,
  IsNotEmptyObject,
  IsString,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateQuestionDto {
  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  correctAnswer: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  options: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  prompt: string;

  @ApiProperty({
    required: true,
    type: () => QuizDto,
  })
  @ValidateNested()
  @Type(() => QuizDto)
  @IsNotEmptyObject()
  quiz: QuizDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
