import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ReviewDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  id: string;
}
