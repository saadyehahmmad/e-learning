import { ApiProperty } from '@nestjs/swagger';
import { PlacementQuestion } from './placement-question';

/**
 * Placement test aggregate: metadata + embedded questions (single persistence row).
 */
export class Placement {
  @ApiProperty()
  id: string;

  @ApiProperty({ type: () => [PlacementQuestion] })
  questions: PlacementQuestion[];

  @ApiProperty({ nullable: true })
  passingScore?: number | null;

  @ApiProperty({ nullable: true })
  description?: string | null;

  @ApiProperty()
  title: string;

  @ApiProperty({ nullable: true })
  examDurationMinutes?: number | null;

  @ApiProperty({ nullable: true })
  quizDescription?: string | null;

  @ApiProperty({ nullable: true })
  courseTitle?: string | null;

  @ApiProperty({ nullable: true })
  courseLevel?: string | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
