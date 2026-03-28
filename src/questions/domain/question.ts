import { Quiz } from '../../quizzes/domain/quiz';
import { ApiProperty } from '@nestjs/swagger';

export class Question {
  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  correctAnswer: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  options: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  prompt: string;

  @ApiProperty({
    type: () => Quiz,
    nullable: false,
  })
  quiz: Quiz;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
