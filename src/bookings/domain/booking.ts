import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Booking {
  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  tutor: User;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  student: User;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  status: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  startTime: string;

  @ApiProperty({
    type: () => Date,
    nullable: false,
  })
  bookingDate: Date;

  @ApiProperty({
    type: () => String,
    nullable: true,
    enum: ['zoom', 'google_meet'],
  })
  meetingProvider?: 'zoom' | 'google_meet' | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  meetingLink?: string | null;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
