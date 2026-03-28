import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here

  IsNumber,
  IsString,
  ValidateNested,
  IsNotEmptyObject,
} from 'class-validator';

import {
  // decorators here
  ApiProperty,
} from '@nestjs/swagger';

import {
  // decorators here
  Type,
} from 'class-transformer';

export class CreateAvailabilityDto {
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
    type: () => String,
  })
  @IsString()
  endTime: string;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  startTime: string;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  dayOfWeek: number;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
