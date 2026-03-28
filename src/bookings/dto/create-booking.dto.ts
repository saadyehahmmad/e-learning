import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here

  Transform,
  Type,
} from 'class-transformer';

import {
  // decorators here

  IsDate,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
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

  @ApiProperty({
    required: false,
    enum: ['zoom', 'google_meet'],
  })
  @IsOptional()
  @IsString()
  @IsIn(['zoom', 'google_meet'])
  meetingProvider?: 'zoom' | 'google_meet';

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  @IsUrl(
    {
      require_protocol: true,
    },
    {
      message: 'meetingLink must be a valid URL',
    },
  )
  meetingLink?: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
