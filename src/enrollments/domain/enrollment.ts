import { Course } from '../../courses/domain/course';
import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Enrollment {
  @ApiProperty({
    type: () => Course,
    nullable: false,
  })
  course: Course;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  student: User;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  progress?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  status: string;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
