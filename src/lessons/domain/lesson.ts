import { Course } from '../../courses/domain/course';
import { ApiProperty } from '@nestjs/swagger';

export class Lesson {
  @ApiProperty({
    type: () => Course,
    nullable: false,
  })
  course: Course;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  lessonOrder: number;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  videoUrl?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  content?: string | null;

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
