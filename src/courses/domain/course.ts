import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Course {
  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  tutor: User;

  @ApiProperty({
    type: () => Number,
    nullable: true,
  })
  price?: number | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  level: string;

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
