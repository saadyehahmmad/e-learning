import { User } from '../../users/domain/user';
import { Enrollment } from '../../enrollments/domain/enrollment';
import { ApiProperty } from '@nestjs/swagger';

export class Payment {
  @ApiProperty({
    type: () => Date,
    nullable: true,
  })
  paidAt?: Date | null;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  providerReference?: string | null;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  status: string;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  currency: string;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  amount: number;

  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  student: User;

  @ApiProperty({
    type: () => Enrollment,
    nullable: false,
  })
  enrollment: Enrollment;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
