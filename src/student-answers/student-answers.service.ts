import { QuizzesService } from '../quizzes/quizzes.service';
import { Quiz } from '../quizzes/domain/quiz';

import { QuestionsService } from '../questions/questions.service';
import { Question } from '../questions/domain/question';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateStudentAnswerDto } from './dto/create-student-answer.dto';
import { UpdateStudentAnswerDto } from './dto/update-student-answer.dto';
import { StudentAnswerRepository } from './infrastructure/persistence/student-answer.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { StudentAnswer } from './domain/student-answer';

@Injectable()
export class StudentAnswersService {
  constructor(
    private readonly quizService: QuizzesService,

    private readonly questionService: QuestionsService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly studentAnswerRepository: StudentAnswerRepository,
  ) {}

  async create(createStudentAnswerDto: CreateStudentAnswerDto) {
    // Do not remove comment below.
    // <creating-property />

    const quizObject = await this.quizService.findById(
      createStudentAnswerDto.quiz.id,
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

    const questionObject = await this.questionService.findById(
      createStudentAnswerDto.question.id,
    );
    if (!questionObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          question: 'notExists',
        },
      });
    }
    const question = questionObject;

    const studentObject = await this.userService.findById(
      createStudentAnswerDto.student.id,
    );
    if (!studentObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          student: 'notExists',
        },
      });
    }
    const student = studentObject;

    return this.studentAnswerRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      submittedAt: createStudentAnswerDto.submittedAt,

      isCorrect: createStudentAnswerDto.isCorrect,

      answer: createStudentAnswerDto.answer,

      quiz,

      question,

      student,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.studentAnswerRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: StudentAnswer['id']) {
    return this.studentAnswerRepository.findById(id);
  }

  findByIds(ids: StudentAnswer['id'][]) {
    return this.studentAnswerRepository.findByIds(ids);
  }

  async update(
    id: StudentAnswer['id'],

    updateStudentAnswerDto: UpdateStudentAnswerDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let quiz: Quiz | undefined = undefined;

    if (updateStudentAnswerDto.quiz) {
      const quizObject = await this.quizService.findById(
        updateStudentAnswerDto.quiz.id,
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

    let question: Question | undefined = undefined;

    if (updateStudentAnswerDto.question) {
      const questionObject = await this.questionService.findById(
        updateStudentAnswerDto.question.id,
      );
      if (!questionObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            question: 'notExists',
          },
        });
      }
      question = questionObject;
    }

    let student: User | undefined = undefined;

    if (updateStudentAnswerDto.student) {
      const studentObject = await this.userService.findById(
        updateStudentAnswerDto.student.id,
      );
      if (!studentObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            student: 'notExists',
          },
        });
      }
      student = studentObject;
    }

    return this.studentAnswerRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      submittedAt: updateStudentAnswerDto.submittedAt,

      isCorrect: updateStudentAnswerDto.isCorrect,

      answer: updateStudentAnswerDto.answer,

      quiz,

      question,

      student,
    });
  }

  remove(id: StudentAnswer['id']) {
    return this.studentAnswerRepository.remove(id);
  }
}
