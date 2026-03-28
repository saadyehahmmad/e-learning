import { Quiz } from '../../quizzes/domain/quiz';
import { Question } from '../../questions/domain/question';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class StudentAnswer {
  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  submittedAt?: Date;

  @ApiProperty({
    type: () => Boolean,
    nullable: false,
  })
  isCorrect?: boolean;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  answer: string;

  @ApiProperty({
    type: () => Quiz,
    nullable: false,
  })
  quiz: Quiz;

  @ApiProperty({
    type: () => Question,
    nullable: false,
  })
  question: Question;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  student: User;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
