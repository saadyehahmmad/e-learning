import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here

  IsString,
  IsOptional,
  IsNumber,
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

export class CreateCourseDto {
  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  tutor: UserDto;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  price?: number | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  level: string;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  title: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
