import { UserDto } from '../../users/dto/user.dto';

import {
  // decorators here

  IsNumber,
  IsString,
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

export class CreateReviewDto {
  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  reviewer: UserDto;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  targetType: string;

  @ApiProperty({
    required: false,
    type: () => String,
  })
  @IsOptional()
  @IsString()
  comment?: string | null;

  @ApiProperty({
    required: true,
    type: () => Number,
  })
  @IsNumber()
  rating: number;

  // Don't forget to use the class-validator decorators in the DTO properties.
}
