import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Availability {
  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  tutor: User;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  endTime: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  startTime: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  dayOfWeek: number;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
