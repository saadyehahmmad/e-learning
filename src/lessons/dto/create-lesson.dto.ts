import { CourseDto } from '../../courses/dto/course.dto';

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

export class CreateLessonDto {
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
    type: () => Number,
  })
  @IsNumber()
  lessonOrder: number;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  videoUrl?: string | null;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  content?: string | null;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  title: string;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
