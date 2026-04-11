import { ApiProperty } from '@nestjs/swagger';

/**
 * One question stored inside {@link Placement} JSONB (`placement.questions`).
 */
export class PlacementQuestion {
  @ApiProperty()
  id: string;

  @ApiProperty()
  prompt: string;

  /** Serialized options payload (JSON string, same format as legacy `question.options`). */
  @ApiProperty()
  options: string;

  @ApiProperty()
  correctAnswer: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
