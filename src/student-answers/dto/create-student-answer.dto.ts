import { PlacementDto } from '../../placement/dto/placement.dto';

import { UserDto } from '../../users/dto/user.dto';

import { Type } from 'class-transformer';

import { ValidateNested, IsNotEmptyObject, IsString } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentAnswerDto {
  submittedAt?: Date;

  isCorrect?: boolean;

  @ApiProperty({
    required: true,
    type: () => String,
  })
  @IsString()
  answer: string;

  @ApiProperty({
    required: true,
    type: () => PlacementDto,
  })
  @ValidateNested()
  @Type(() => PlacementDto)
  @IsNotEmptyObject()
  placement: PlacementDto;

  @ApiProperty({
    required: true,
    description: 'Question id inside placement.questions',
  })
  @IsString()
  questionId: string;

  @ApiProperty({
    required: true,
    type: () => UserDto,
  })
  @ValidateNested()
  @Type(() => UserDto)
  @IsNotEmptyObject()
  student: UserDto;
}
