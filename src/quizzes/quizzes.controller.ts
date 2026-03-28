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
  ForbiddenException,
  NotFoundException,
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
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

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
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiCreatedResponse({
    type: Quiz,
  })
  create(@Body() createQuizDto: CreateQuizDto) {
    return this.quizzesService.create(createQuizDto);
  }

  @Get(':id/questions')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async getQuestions(@Param('id') id: string) {
    const quiz = await this.quizzesService.findById(id);
    if (!quiz) {
      throw new NotFoundException('Quiz not found');
    }

    return this.quizzesService.getQuestionsByQuizId(id);
  }

  @Get(':id/answers')
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async getQuizAnswers(@Request() request, @Param('id') id: string) {
    await this._assertPlacementResultsAccessIfNeeded(request, id);
    return this.quizzesService.getAnswersByQuizId(id);
  }

  @Get(':id/my-answers')
  @Roles(RoleEnum.student)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async getMyQuizAnswers(@Request() request, @Param('id') id: string) {
    const isPlacementQuiz = await this.quizzesService.isPlacementQuizById(id);
    if (isPlacementQuiz) {
      throw new ForbiddenException(
        'Placement test grades are visible to admins only.',
      );
    }

    return this.quizzesService.getAnswersByQuizIdAndStudentId(
      id,
      request.user.id,
    );
  }

  @Get(':id/my-attempt-status')
  @Roles(RoleEnum.student)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async getMyQuizAttemptStatus(@Request() request, @Param('id') id: string) {
    const summary = await this.quizzesService.getStudentAttemptSummary(
      id,
      request.user.id,
    );
    return {
      hasAttempt: summary.attemptCount > 0,
      attemptCount: summary.attemptCount,
      retakeCount: Math.max(0, summary.attemptCount - 1),
      lastSubmittedAt: summary.lastSubmittedAt,
    };
  }

  @Post(':id/submit')
  @Roles(RoleEnum.student)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
    @Request() request,
    @Query() query: FindAllQuizzesDto,
  ): Promise<InfinityPaginationResponseDto<Quiz>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const quizzes = await this.quizzesService.findAllWithPagination({
      paginationOptions: {
        page,
        limit,
      },
    });
    const actorRoleId = Number(request.user?.role?.id);
    const visibleQuizzes =
      actorRoleId === RoleEnum.student
        ? quizzes.filter((quiz) => !this._isPlacementQuizTitle(quiz.title))
        : quizzes;

    return infinityPagination(visibleQuizzes, { page, limit });
  }

  @Get('placement-test')
  @Roles(RoleEnum.admin, RoleEnum.student)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOkResponse({
    type: Quiz,
  })
  getPlacementQuiz() {
    return this.quizzesService.findPlacementQuiz();
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
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
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
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.quizzesService.remove(id);
  }

  /**
   * Prevents non-admin access to placement test grades.
   */
  private async _assertPlacementResultsAccessIfNeeded(
    request,
    quizId: string,
  ): Promise<void> {
    const isPlacementQuiz = await this.quizzesService.isPlacementQuizById(quizId);
    if (!isPlacementQuiz) {
      return;
    }

    const actorRoleId = Number(request.user?.role?.id);
    if (actorRoleId !== RoleEnum.admin) {
      throw new ForbiddenException(
        'Placement test grades are visible to admins only.',
      );
    }
  }

  /**
   * Returns true when quiz title matches placement-test naming pattern.
   */
  private _isPlacementQuizTitle(title: string): boolean {
    const normalized = (title || '').trim().toLowerCase();
    return normalized === 'placement test' || normalized.includes('placement');
  }
}
