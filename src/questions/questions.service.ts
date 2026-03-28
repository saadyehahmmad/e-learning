import { QuizzesService } from '../quizzes/quizzes.service';
import { Quiz } from '../quizzes/domain/quiz';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { QuestionRepository } from './infrastructure/persistence/question.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Question } from './domain/question';

@Injectable()
export class QuestionsService {
  constructor(
    private readonly quizService: QuizzesService,

    // Dependencies here
    private readonly questionRepository: QuestionRepository,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    // Do not remove comment below.
    // <creating-property />

    const quizObject = await this.quizService.findById(
      createQuestionDto.quiz.id,
    );
    if (!quizObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          quiz: 'notExists',
        },
      });
    }
    const quiz = quizObject;

    return this.questionRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      correctAnswer: createQuestionDto.correctAnswer,

      options: createQuestionDto.options,

      prompt: createQuestionDto.prompt,

      quiz,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.questionRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Question['id']) {
    return this.questionRepository.findById(id);
  }

  findByIds(ids: Question['id'][]) {
    return this.questionRepository.findByIds(ids);
  }

  async update(
    id: Question['id'],

    updateQuestionDto: UpdateQuestionDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let quiz: Quiz | undefined = undefined;

    if (updateQuestionDto.quiz) {
      const quizObject = await this.quizService.findById(
        updateQuestionDto.quiz.id,
      );
      if (!quizObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            quiz: 'notExists',
          },
        });
      }
      quiz = quizObject;
    }

    return this.questionRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      correctAnswer: updateQuestionDto.correctAnswer,

      options: updateQuestionDto.options,

      prompt: updateQuestionDto.prompt,

      quiz,
    });
  }

  remove(id: Question['id']) {
    return this.questionRepository.remove(id);
  }
}
