import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { FileDto } from '../../files/dto/file.dto';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AuthUpdateDto {
  @ApiPropertyOptional({ example: 'A2' })
  @IsOptional()
  @IsString()
  englishLevel?: string | null;

  @ApiPropertyOptional({ example: 'Improve speaking confidence' })
  @IsOptional()
  @IsString()
  learningGoals?: string | null;

  @ApiPropertyOptional({ example: 'TESOL, IELTS Teaching' })
  @IsOptional()
  @IsString()
  certifications?: string | null;

  @ApiPropertyOptional({ example: 'English, Arabic' })
  @IsOptional()
  @IsString()
  spokenLanguages?: string | null;

  @ApiPropertyOptional({ example: 25 })
  @IsOptional()
  @IsNumber()
  hourlyRate?: number | null;

  @ApiPropertyOptional({ example: '8 years teaching business English.' })
  @IsOptional()
  @IsString()
  bio?: string | null;

  @ApiPropertyOptional({ type: () => FileDto })
  @IsOptional()
  photo?: FileDto | null;

  @ApiPropertyOptional({ example: 'John' })
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'new.email@example.com' })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @Transform(lowerCaseTransformer)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  oldPassword?: string;
}
