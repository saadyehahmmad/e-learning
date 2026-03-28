import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class StudentAnswerDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
