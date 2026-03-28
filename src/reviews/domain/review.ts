import { User } from '../../users/domain/user';
import { ApiProperty } from '@nestjs/swagger';

export class Review {
  @ApiProperty({
    type: () => User,
    nullable: false,
  })
  reviewer: User;

  @ApiProperty({
    type: () => String,
    nullable: false,
  })
  targetType: string;

  @ApiProperty({
    type: () => String,
    nullable: true,
  })
  comment?: string | null;

  @ApiProperty({
    type: () => Number,
    nullable: false,
  })
  rating: number;

  @ApiProperty({
    type: String,
  })
  id: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
