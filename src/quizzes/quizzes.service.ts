import { CoursesService } from '../courses/courses.service';
import { Course } from '../courses/domain/course';
import { UsersService } from '../users/users.service';
import { QuestionRepository } from '../questions/infrastructure/persistence/question.repository';
import { StudentAnswerRepository } from '../student-answers/infrastructure/persistence/student-answer.repository';
import { SubmitQuizDto } from './dto/submit-quiz.dto';
import { SubmitQuizResponseDto } from './dto/submit-quiz-response.dto';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { QuizRepository } from './infrastructure/persistence/quiz.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Quiz } from './domain/quiz';

@Injectable()
export class QuizzesService {
  constructor(
    private readonly courseService: CoursesService,
    private readonly usersService: UsersService,
    private readonly questionRepository: QuestionRepository,
    private readonly studentAnswerRepository: StudentAnswerRepository,

    // Dependencies here
    private readonly quizRepository: QuizRepository,
  ) {}

  async create(createQuizDto: CreateQuizDto) {
    // Do not remove comment below.
    // <creating-property />
    const courseObject = await this.courseService.findById(
      createQuizDto.course.id,
    );
    if (!courseObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          course: 'notExists',
        },
      });
    }
    const course = courseObject;

    return this.quizRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      course,

      passingScore: createQuizDto.passingScore,

      description: createQuizDto.description,

      title: createQuizDto.title,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.quizRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Quiz['id']) {
    return this.quizRepository.findById(id);
  }

  findByIds(ids: Quiz['id'][]) {
    return this.quizRepository.findByIds(ids);
  }

  async update(
    id: Quiz['id'],

    updateQuizDto: UpdateQuizDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let course: Course | undefined = undefined;

    if (updateQuizDto.course) {
      const courseObject = await this.courseService.findById(
        updateQuizDto.course.id,
      );
      if (!courseObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            course: 'notExists',
          },
        });
      }
      course = courseObject;
    }

    return this.quizRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      course,

      passingScore: updateQuizDto.passingScore,

      description: updateQuizDto.description,

      title: updateQuizDto.title,
    });
  }

  remove(id: Quiz['id']) {
    return this.quizRepository.remove(id);
  }

  /**
   * Evaluates submitted quiz answers and persists each student answer.
   */
  async submit(
    quizId: Quiz['id'],
    studentId: number,
    submitQuizDto: SubmitQuizDto,
  ): Promise<SubmitQuizResponseDto> {
    const quiz = await this.quizRepository.findById(quizId);
    if (!quiz) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          quiz: 'notExists',
        },
      });
    }

    const student = await this.usersService.findById(studentId);
    if (!student) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          student: 'notExists',
        },
      });
    }

    const questions = await this.questionRepository.findByQuizId(quizId);
    const questionsById = new Map(
      questions.map((question) => [String(question.id), question]),
    );

    let correctAnswers = 0;
    const results: SubmitQuizResponseDto['answers'] = [];
    const submittedAt = new Date();

    for (const submittedAnswer of submitQuizDto.answers) {
      const question = questionsById.get(submittedAnswer.questionId);

      if (!question) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            questionId: `invalidForQuiz:${submittedAnswer.questionId}`,
          },
        });
      }

      const isCorrect =
        question.correctAnswer.trim().toLowerCase() ===
        submittedAnswer.answer.trim().toLowerCase();

      if (isCorrect) {
        correctAnswers += 1;
      }

      await this.studentAnswerRepository.create({
        answer: submittedAnswer.answer,
        isCorrect,
        submittedAt,
        question,
        quiz,
        student,
      });

      results.push({
        questionId: String(question.id),
        isCorrect,
      });
    }

    const answeredQuestions = submitQuizDto.answers.length;
    const score = answeredQuestions
      ? Math.round((correctAnswers / answeredQuestions) * 100)
      : 0;
    const passingScore = quiz.passingScore ?? null;

    return {
      quizId: String(quiz.id),
      totalQuestions: questions.length,
      answeredQuestions,
      correctAnswers,
      score,
      passingScore,
      passed: passingScore === null ? true : score >= passingScore,
      answers: results,
    };
  }
}
