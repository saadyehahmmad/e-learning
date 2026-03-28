import { ApiProperty } from '@nestjs/swagger';

export class SubmitQuizAnswerResultDto {
  @ApiProperty({ example: '3f8d44d5-10b1-4e13-b41e-2ddf4a9f1d31' })
  questionId: string;

  @ApiProperty({ example: true })
  isCorrect: boolean;
}

export class SubmitQuizResponseDto {
  @ApiProperty({ example: '9ff4e0a4-4f5c-4cb8-bd48-34ffadce0c9a' })
  quizId: string;

  @ApiProperty({ example: 10 })
  totalQuestions: number;

  @ApiProperty({ example: 10 })
  answeredQuestions: number;

  @ApiProperty({ example: 8 })
  correctAnswers: number;

  @ApiProperty({ example: 80 })
  score: number;

  @ApiProperty({ example: 70, nullable: true })
  passingScore?: number | null;

  @ApiProperty({ example: true })
  passed: boolean;

  @ApiProperty({ type: () => [SubmitQuizAnswerResultDto] })
  answers: SubmitQuizAnswerResultDto[];
}
