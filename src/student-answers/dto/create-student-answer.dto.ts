import { QuizDto } from '../../quizzes/dto/quiz.dto';

import { QuestionDto } from '../../questions/dto/question.dto';

import { UserDto } from '../../users/dto/user.dto';

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

export class CreateStudentAnswerDto {
  submittedAt?: Date;

  isCorrect?: boolean;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  answer: string;

  @ApiProperty({
    required: true,
    type: () => QuizDto,
  })
  @ValidateNested()
  @Type(() => QuizDto)
  @IsNotEmptyObject()
  quiz: QuizDto;

  @ApiProperty({
    required: true,
    type: () => QuestionDto,
  })
  @ValidateNested()
  @Type(() => QuestionDto)
  @IsNotEmptyObject()
  question: QuestionDto;

  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  student: UserDto;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
