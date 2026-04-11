import { ApiProperty } from '@nestjs/swagger';

/**
 * Per-question grading row in a placement submit response.
 */
export class PlacementSubmitAnswerResultDto {
  @ApiProperty({ description: 'Question uuid (no q_ prefix)' })
  questionId: string;

  @ApiProperty()
  isCorrect: boolean;
}

/**
 * Result of submitting a placement attempt.
 */
export class SubmitPlacementResponseDto {
  @ApiProperty({ description: 'Placement row id (uuid)' })
  placementId: string;

  @ApiProperty()
  totalQuestions: number;

  @ApiProperty()
  answeredQuestions: number;

  @ApiProperty()
  correctAnswers: number;

  @ApiProperty()
  score: number;

  @ApiProperty({ nullable: true })
  passingScore: number | null;

  @ApiProperty()
  passed: boolean;

  @ApiProperty({ type: () => [PlacementSubmitAnswerResultDto] })
  answers: PlacementSubmitAnswerResultDto[];
}
