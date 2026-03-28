import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class QuizDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
