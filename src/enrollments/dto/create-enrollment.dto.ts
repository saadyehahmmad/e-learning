import { CourseDto } from '../../courses/dto/course.dto';

import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here

  IsString,
  IsNumber,
  IsOptional,
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

export class CreateEnrollmentDto {
  @ApiProperty({
    required: true,
    type: () => CourseDto,
  })
  @ValidateNested()
  @Type(() => CourseDto)
  @IsNotEmptyObject()
  course: CourseDto;

  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  student: UserDto;

  @ApiProperty({
    required: false,
    type: () => Number,
  })
  @IsOptional()
  @IsNumber()
  progress?: number | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  status: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
