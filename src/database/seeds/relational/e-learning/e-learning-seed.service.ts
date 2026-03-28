import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleEnum } from '../../../../roles/roles.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { CourseEntity } from '../../../../courses/infrastructure/persistence/relational/entities/course.entity';
import { LessonEntity } from '../../../../lessons/infrastructure/persistence/relational/entities/lesson.entity';
import { EnrollmentEntity } from '../../../../enrollments/infrastructure/persistence/relational/entities/enrollment.entity';
import { AvailabilityEntity } from '../../../../availabilities/infrastructure/persistence/relational/entities/availability.entity';
import { BookingEntity } from '../../../../bookings/infrastructure/persistence/relational/entities/booking.entity';
import { ReviewEntity } from '../../../../reviews/infrastructure/persistence/relational/entities/review.entity';
import { QuizEntity } from '../../../../quizzes/infrastructure/persistence/relational/entities/quiz.entity';
import { QuestionEntity } from '../../../../questions/infrastructure/persistence/relational/entities/question.entity';
import { StudentAnswerEntity } from '../../../../student-answers/infrastructure/persistence/relational/entities/student-answer.entity';
import { PaymentEntity } from '../../../../payments/infrastructure/persistence/relational/entities/payment.entity';
import { PaymentStatusEnum } from '../../../../payments/payment-status.enum';

const SEEDED_TUTOR_EMAIL = 'user@tutor.com';
const SEEDED_STUDENT_EMAIL = 'user@student.com';

@Injectable()
export class ELearningSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(CourseEntity)
    private readonly coursesRepository: Repository<CourseEntity>,
    @InjectRepository(LessonEntity)
    private readonly lessonsRepository: Repository<LessonEntity>,
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentsRepository: Repository<EnrollmentEntity>,
    @InjectRepository(AvailabilityEntity)
    private readonly availabilitiesRepository: Repository<AvailabilityEntity>,
    @InjectRepository(BookingEntity)
    private readonly bookingsRepository: Repository<BookingEntity>,
    @InjectRepository(ReviewEntity)
    private readonly reviewsRepository: Repository<ReviewEntity>,
    @InjectRepository(QuizEntity)
    private readonly quizzesRepository: Repository<QuizEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionsRepository: Repository<QuestionEntity>,
    @InjectRepository(StudentAnswerEntity)
    private readonly studentAnswersRepository: Repository<StudentAnswerEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentsRepository: Repository<PaymentEntity>,
  ) {}

  /**
   * Seeds a full e-learning dataset for tutor/student workflows.
   */
  async run(): Promise<void> {
    const tutor = await this.usersRepository.findOne({
      where: { email: SEEDED_TUTOR_EMAIL, role: { id: RoleEnum.tutor } },
    });
    const student = await this.usersRepository.findOne({
      where: { email: SEEDED_STUDENT_EMAIL, role: { id: RoleEnum.student } },
    });

    if (!tutor || !student) {
      throw new NotFoundException(
        `Seed users ${SEEDED_TUTOR_EMAIL} and ${SEEDED_STUDENT_EMAIL} must exist before E-Learning seed runs`,
      );
    }

    const courseA = await this.ensureCourse({
      title: 'English Foundations A1',
      description: 'Beginner grammar, vocabulary, and speaking confidence.',
      level: 'A1',
      price: 49.99,
      tutor,
    });
    const courseB = await this.ensureCourse({
      title: 'Business English B2',
      description: 'Professional communication for meetings and email writing.',
      level: 'B2',
      price: 119.0,
      tutor,
    });

    await this.ensureLesson({
      course: courseA,
      lessonOrder: 1,
      title: 'Greetings and Introductions',
      content: 'Basic greetings, introductions, and polite expressions.',
      videoUrl: 'https://example.com/videos/a1-lesson-1',
    });
    await this.ensureLesson({
      course: courseA,
      lessonOrder: 2,
      title: 'Daily Routines',
      content: 'Present simple forms through daily routine conversations.',
      videoUrl: 'https://example.com/videos/a1-lesson-2',
    });

    const enrollmentA = await this.ensureEnrollment({
      course: courseA,
      student,
      status: 'active',
      progress: 35,
    });
    await this.ensureEnrollment({
      course: courseB,
      student,
      status: 'pending',
      progress: 0,
    });

    await this.ensureAvailability({
      tutor,
      dayOfWeek: 1,
      startTime: '18:00',
      endTime: '20:00',
    });
    await this.ensureAvailability({
      tutor,
      dayOfWeek: 3,
      startTime: '17:00',
      endTime: '19:00',
    });

    await this.ensureBooking({
      tutor,
      student,
      bookingDate: new Date('2026-04-05T00:00:00.000Z'),
      startTime: '18:00',
      status: 'confirmed',
    });

    await this.ensureReview({
      reviewer: student,
      targetType: 'tutor',
      rating: 5,
      comment: 'Very clear explanations and useful speaking tips.',
    });

    const placementQuiz = await this.ensureQuiz({
      course: courseA,
      title: 'Placement Test',
      description:
        'One-time entry assessment with 50 timed questions for level grading.',
      passingScore: 60,
    });
    const placementQuestions = this._buildPlacementQuestions();
    for (const questionData of placementQuestions) {
      await this.ensureQuestion({
        quiz: placementQuiz,
        prompt: questionData.prompt,
        options: questionData.options,
        correctAnswer: questionData.correctAnswer,
      });
    }

    await this.ensurePayment({
      enrollment: enrollmentA,
      student,
      amount: 50,
      currency: 'USD',
      status: PaymentStatusEnum.paid,
      providerReference: 'seed-payment-english-foundations-a1',
      paidAt: new Date('2026-04-01T11:00:00.000Z'),
    });
  }

  /**
   * Creates course if it does not already exist.
   */
  private async ensureCourse(data: {
    title: string;
    description: string;
    level: string;
    price: number;
    tutor: UserEntity;
  }): Promise<CourseEntity> {
    const existing = await this.coursesRepository.findOne({
      where: { title: data.title, tutor: { id: data.tutor.id } },
    });
    if (existing) {
      return existing;
    }

    return this.coursesRepository.save(this.coursesRepository.create(data));
  }

  /**
   * Creates lesson if it does not already exist.
   */
  private async ensureLesson(data: {
    course: CourseEntity;
    lessonOrder: number;
    title: string;
    content: string;
    videoUrl: string;
  }): Promise<LessonEntity> {
    const existing = await this.lessonsRepository.findOne({
      where: { course: { id: data.course.id }, lessonOrder: data.lessonOrder },
    });
    if (existing) {
      return existing;
    }

    return this.lessonsRepository.save(this.lessonsRepository.create(data));
  }

  /**
   * Creates enrollment if it does not already exist.
   */
  private async ensureEnrollment(data: {
    course: CourseEntity;
    student: UserEntity;
    status: string;
    progress: number;
  }): Promise<EnrollmentEntity> {
    const existing = await this.enrollmentsRepository.findOne({
      where: {
        course: { id: data.course.id },
        student: { id: data.student.id },
      },
    });
    if (existing) {
      return existing;
    }

    return this.enrollmentsRepository.save(
      this.enrollmentsRepository.create(data),
    );
  }

  /**
   * Creates availability slot if it does not already exist.
   */
  private async ensureAvailability(data: {
    tutor: UserEntity;
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }): Promise<AvailabilityEntity> {
    const existing = await this.availabilitiesRepository.findOne({
      where: {
        tutor: { id: data.tutor.id },
        dayOfWeek: data.dayOfWeek,
        startTime: data.startTime,
      },
    });
    if (existing) {
      return existing;
    }

    return this.availabilitiesRepository.save(
      this.availabilitiesRepository.create(data),
    );
  }

  /**
   * Creates booking if it does not already exist.
   */
  private async ensureBooking(data: {
    tutor: UserEntity;
    student: UserEntity;
    bookingDate: Date;
    startTime: string;
    status: string;
  }): Promise<BookingEntity> {
    const existing = await this.bookingsRepository.findOne({
      where: {
        tutor: { id: data.tutor.id },
        student: { id: data.student.id },
        bookingDate: data.bookingDate,
        startTime: data.startTime,
      },
    });
    if (existing) {
      return existing;
    }

    return this.bookingsRepository.save(this.bookingsRepository.create(data));
  }

  /**
   * Creates review if it does not already exist.
   */
  private async ensureReview(data: {
    reviewer: UserEntity;
    targetType: string;
    rating: number;
    comment: string;
  }): Promise<ReviewEntity> {
    const existing = await this.reviewsRepository.findOne({
      where: {
        reviewer: { id: data.reviewer.id },
        targetType: data.targetType,
        comment: data.comment,
      },
    });
    if (existing) {
      return existing;
    }

    return this.reviewsRepository.save(this.reviewsRepository.create(data));
  }

  /**
   * Creates quiz if it does not already exist.
   */
  private async ensureQuiz(data: {
    course: CourseEntity;
    title: string;
    description: string;
    passingScore: number;
  }): Promise<QuizEntity> {
    const existing = await this.quizzesRepository.findOne({
      where: { course: { id: data.course.id }, title: data.title },
    });
    if (existing) {
      return existing;
    }

    return this.quizzesRepository.save(this.quizzesRepository.create(data));
  }

  /**
   * Creates question if it does not already exist.
   */
  private async ensureQuestion(data: {
    quiz: QuizEntity;
    prompt: string;
    options: string;
    correctAnswer: string;
  }): Promise<QuestionEntity> {
    const existing = await this.questionsRepository.findOne({
      where: { quiz: { id: data.quiz.id }, prompt: data.prompt },
    });
    if (existing) {
      return existing;
    }

    return this.questionsRepository.save(this.questionsRepository.create(data));
  }

  /**
   * Creates student answer if it does not already exist.
   */
  private async ensureStudentAnswer(data: {
    student: UserEntity;
    quiz: QuizEntity;
    question: QuestionEntity;
    answer: string;
    isCorrect: boolean;
    submittedAt: Date;
  }): Promise<StudentAnswerEntity> {
    const existing = await this.studentAnswersRepository.findOne({
      where: {
        student: { id: data.student.id },
        question: { id: data.question.id },
      },
    });
    if (existing) {
      return existing;
    }

    return this.studentAnswersRepository.save(
      this.studentAnswersRepository.create(data),
    );
  }

  /**
   * Creates payment if it does not already exist.
   */
  private async ensurePayment(data: {
    enrollment: EnrollmentEntity;
    student: UserEntity;
    amount: number;
    currency: string;
    status: string;
    providerReference: string;
    paidAt: Date;
  }): Promise<PaymentEntity> {
    const existing = await this.paymentsRepository.findOne({
      where: {
        enrollment: { id: data.enrollment.id },
        student: { id: data.student.id },
        providerReference: data.providerReference,
      },
    });
    if (existing) {
      return existing;
    }

    return this.paymentsRepository.save(this.paymentsRepository.create(data));
  }

  /**
   * Builds 50 placement questions with single, multi, and text answer formats.
   */
  private _buildPlacementQuestions(): Array<{
    prompt: string;
    options: string;
    correctAnswer: string;
  }> {
    const singleQuestions = Array.from({ length: 20 }).map((_, index) => {
      const number = index + 1;
      return {
        prompt: `Single ${number}: Choose the correct sentence form.`,
        options: JSON.stringify({
          type: 'single',
          options: [
            `I has lesson ${number}.`,
            `I have lesson ${number}.`,
            `I having lesson ${number}.`,
            `I am have lesson ${number}.`,
          ],
        }),
        correctAnswer: `I have lesson ${number}.`,
      };
    });

    const multiQuestions = Array.from({ length: 15 }).map((_, index) => {
      const number = index + 1;
      const optionA = `a${number} grammar`;
      const optionB = `b${number} vocabulary`;
      const optionC = `c${number} spelling`;
      const optionD = `d${number} punctuation`;
      return {
        prompt: `Multi ${number}: Select all core language skills.`,
        options: JSON.stringify({
          type: 'multi',
          options: [optionA, optionB, optionC, optionD],
        }),
        correctAnswer: [optionA, optionB, optionC].sort().join('||'),
      };
    });

    const textQuestions = Array.from({ length: 15 }).map((_, index) => {
      const number = index + 1;
      return {
        prompt: `Text ${number}: Write the past tense of "go".`,
        options: JSON.stringify({
          type: 'text',
          options: [],
        }),
        correctAnswer: 'went',
      };
    });

    return [...singleQuestions, ...multiQuestions, ...textQuestions];
  }
}
