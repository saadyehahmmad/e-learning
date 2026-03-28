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
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Question } from './domain/question';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllQuestionsDto } from './dto/find-all-questions.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { QuizzesService } from '../quizzes/quizzes.service';

@ApiTags('Questions')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'questions',
  version: '1',
})
export class QuestionsController {
  constructor(
    private readonly questionsService: QuestionsService,
    private readonly quizzesService: QuizzesService,
  ) {}

  @Post()
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiCreatedResponse({
    type: Question,
  })
  async create(@Request() request, @Body() createQuestionDto: CreateQuestionDto) {
    await this._assertPlacementQuestionRulesForCreate(
      request,
      createQuestionDto.quiz.id,
    );
    return this.questionsService.create(createQuestionDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Question),
  })
  async findAll(
    @Query() query: FindAllQuestionsDto,
  ): Promise<InfinityPaginationResponseDto<Question>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.questionsService.findAllWithPagination({
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
    type: Question,
  })
  findById(@Param('id') id: string) {
    return this.questionsService.findById(id);
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
    type: Question,
  })
  update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    return this._authorizeAndUpdate(request, id, updateQuestionDto);
  }

  /**
   * Applies placement rules then persists question updates.
   */
  private async _authorizeAndUpdate(
    request,
    id: string,
    updateQuestionDto: UpdateQuestionDto,
  ) {
    await this._assertPlacementQuestionRulesForUpdate(request, id, updateQuestionDto);
    return this.questionsService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async remove(@Request() request, @Param('id') id: string) {
    await this._assertPlacementQuestionRulesForDelete(request, id);
    return this.questionsService.remove(id);
  }

  /**
   * Applies placement constraints before creating question.
   */
  private async _assertPlacementQuestionRulesForCreate(
    request,
    quizId: string,
  ): Promise<void> {
    const isPlacementQuiz = await this.quizzesService.isPlacementQuizById(quizId);
    if (!isPlacementQuiz) {
      return;
    }

    this._assertAdminForPlacementQuestionMutation(request);
    const questions = await this.quizzesService.getQuestionsByQuizId(quizId);
    if (questions.length >= 50) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          placementTest: 'max50Questions',
        },
      });
    }
  }

  /**
   * Applies placement constraints before updating question.
   */
  private async _assertPlacementQuestionRulesForUpdate(
    request,
    questionId: string,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<void> {
    const existingQuestion = await this.questionsService.findById(questionId);
    if (!existingQuestion) {
      throw new NotFoundException('Question not found');
    }

    const isCurrentPlacement = await this.quizzesService.isPlacementQuizById(
      existingQuestion.quiz.id,
    );
    const targetQuizId = updateQuestionDto.quiz?.id ?? existingQuestion.quiz.id;
    const isTargetPlacement = await this.quizzesService.isPlacementQuizById(targetQuizId);

    if (!isCurrentPlacement && !isTargetPlacement) {
      return;
    }

    this._assertAdminForPlacementQuestionMutation(request);

    if (isCurrentPlacement && !isTargetPlacement) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          placementTest: 'cannotMoveQuestionOut',
        },
      });
    }

    if (!isCurrentPlacement && isTargetPlacement) {
      const targetQuestions = await this.quizzesService.getQuestionsByQuizId(targetQuizId);
      if (targetQuestions.length >= 50) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            placementTest: 'max50Questions',
          },
        });
      }
    }
  }

  /**
   * Applies placement constraints before deleting question.
   */
  private async _assertPlacementQuestionRulesForDelete(
    request,
    questionId: string,
  ): Promise<void> {
    const question = await this.questionsService.findById(questionId);
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const isPlacementQuiz = await this.quizzesService.isPlacementQuizById(
      question.quiz.id,
    );
    if (!isPlacementQuiz) {
      return;
    }

    this._assertAdminForPlacementQuestionMutation(request);
  }

  /**
   * Restricts placement question mutations to admin users only.
   */
  private _assertAdminForPlacementQuestionMutation(request): void {
    const actorRoleId = Number(request.user?.role?.id);
    if (actorRoleId !== RoleEnum.admin) {
      throw new ForbiddenException(
        'Only admins can edit placement test questions.',
      );
    }
  }
}
