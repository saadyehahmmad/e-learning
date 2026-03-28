import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { StudentAnswersService } from './student-answers.service';
import { CreateStudentAnswerDto } from './dto/create-student-answer.dto';
import { UpdateStudentAnswerDto } from './dto/update-student-answer.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { StudentAnswer } from './domain/student-answer';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllStudentAnswersDto } from './dto/find-all-student-answers.dto';

@ApiTags('Studentanswers')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'student-answers',
  version: '1',
})
export class StudentAnswersController {
  constructor(private readonly studentAnswersService: StudentAnswersService) {}

  @Post()
  @ApiCreatedResponse({
    type: StudentAnswer,
  })
  create(@Body() createStudentAnswerDto: CreateStudentAnswerDto) {
    return this.studentAnswersService.create(createStudentAnswerDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(StudentAnswer),
  })
  async findAll(
    @Query() query: FindAllStudentAnswersDto,
  ): Promise<InfinityPaginationResponseDto<StudentAnswer>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.studentAnswersService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: StudentAnswer,
  })
  findById(@Param('id') id: string) {
    return this.studentAnswersService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: StudentAnswer,
  })
  update(
    @Param('id') id: string,
    @Body() updateStudentAnswerDto: UpdateStudentAnswerDto,
  ) {
    return this.studentAnswersService.update(id, updateStudentAnswerDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.studentAnswersService.remove(id);
  }
}
