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
  Request,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Quiz } from './domain/quiz';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllQuizzesDto } from './dto/find-all-quizzes.dto';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { SubmitQuizResponseDto } from './dto/submit-quiz-response.dto';

@ApiTags('Quizzes')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'quizzes',
  version: '1',
})
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  @ApiCreatedResponse({
    type: Quiz,
  })
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Post(':id/submit')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: SubmitQuizResponseDto,
  })
  submit(
    @Param('id') id: string,
    @Request() request,
    @Body() submitQuizDto: SubmitQuizDto,
  ) {
    return this.quizzesService.submit(id, request.user.id, submitQuizDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Quiz),
  })
  async findAll(
    @Query() query: FindAllQuizzesDto,
  ): Promise<InfinityPaginationResponseDto<Quiz>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.quizzesService.findAllWithPagination({
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
    type: Quiz,
  })
  findById(@Param('id') id: string) {
    return this.quizzesService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Quiz,
  })
  update(@Param('id') id: string, @Body() updateQuizDto: UpdateQuizDto) {
    return this.quizzesService.update(id, updateQuizDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }
}
