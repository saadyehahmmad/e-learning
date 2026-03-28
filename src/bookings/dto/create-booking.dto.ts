import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here

  Transform,
  Type,
} from 'class-transformer';

import {
  // decorators here

  IsDate,
  IsString,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

export class CreateBookingDto {
  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  tutor: UserDto;

  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  student: UserDto;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  status: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    required: true,
    type: () => Date,
  })
  @Transform(({ value }) => new Date(value))
  @IsDate()
  bookingDate: Date;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
