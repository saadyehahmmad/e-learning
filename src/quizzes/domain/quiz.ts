import { Course } from '../../courses/domain/course';
import { ApiProperty } from '@nestjs/swagger';

export class Quiz {
  @ApiProperty({
    type: () => Course,
    nullable: false,
  })
  course: Course;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  passingScore?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  title: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
