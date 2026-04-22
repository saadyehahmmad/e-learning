import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { RoleEnum } from '../../../../roles/roles.enum';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import {
  PlacementEntity,
  PlacementQuestionJson,
} from '../../../../placement/infrastructure/persistence/relational/entities/placement.entity';
import { StudentAnswerEntity } from '../../../../student-answers/infrastructure/persistence/relational/entities/student-answer.entity';
import { PaymentEntity } from '../../../../payments/infrastructure/persistence/relational/entities/payment.entity';
import { PaymentStatusEnum } from '../../../../payments/payment-status.enum';

const SEEDED_STUDENT_EMAIL = 'user@student.com';

@Injectable()
export class ELearningSeedService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(PlacementEntity)
    private readonly placementRepository: Repository<PlacementEntity>,
    @InjectRepository(StudentAnswerEntity)
    private readonly studentAnswersRepository: Repository<StudentAnswerEntity>,
    @InjectRepository(PaymentEntity)
    private readonly paymentsRepository: Repository<PaymentEntity>,
  ) {}

  /**
   * Seeds placement test, optional sample answers/payment for the demo student.
   */
  async run(): Promise<void> {
    const student = await this.usersRepository.findOne({
      where: { email: SEEDED_STUDENT_EMAIL, role: { id: RoleEnum.student } },
    });

    if (!student) {
      throw new NotFoundException(
        `Seed user ${SEEDED_STUDENT_EMAIL} must exist before E-Learning seed runs`,
      );
    }

    const placement = await this.ensurePlacement({
      title: 'Placement Test',
      description:
        'One-time entry assessment with timed questions for level grading.',
      passingScore: 60,
      examDurationMinutes: 50,
      quizDescription: 'Placement exam description for learners',
      courseTitle: 'Placement Course',
      courseLevel: 'all',
    });

    const placementQuestions = this._buildPlacementQuestions();
    if (!placement.questions?.length) {
      placement.questions = placementQuestions;
      await this.placementRepository.save(placement);
    }

    const qList = placement.questions;
    if (qList.length >= 2) {
      await this.ensureStudentAnswer({
        student,
        placement,
        questionId: qList[0].id,
        answer: JSON.parse(qList[0].options).options?.[1] ?? 'x',
        isCorrect: true,
      });
    }

    await this.ensurePayment({
      student,
      amount: 50,
      currency: 'USD',
      status: PaymentStatusEnum.paid,
      providerReference: 'seed-payment-demo',
      paidAt: new Date('2026-04-01T11:00:00.000Z'),
    });
  }

  private async ensurePlacement(data: {
    title: string;
    description: string;
    passingScore: number;
    examDurationMinutes: number;
    quizDescription: string;
    courseTitle: string;
    courseLevel: string;
  }): Promise<PlacementEntity> {
    const existing = await this.placementRepository.findOne({
      where: { title: data.title },
    });
    if (existing) {
      return existing;
    }

    return this.placementRepository.save(
      this.placementRepository.create({
        ...data,
        questions: [],
      }),
    );
  }

  private async ensureStudentAnswer(data: {
    student: UserEntity;
    placement: PlacementEntity;
    questionId: string;
    answer: string;
    isCorrect: boolean;
  }): Promise<StudentAnswerEntity> {
    const existing = await this.studentAnswersRepository.findOne({
      where: {
        student: { id: data.student.id },
        placement: { id: data.placement.id },
        questionId: data.questionId,
      },
    });
    if (existing) {
      return existing;
    }

    return this.studentAnswersRepository.save(
      this.studentAnswersRepository.create({
        student: data.student,
        placement: data.placement,
        questionId: data.questionId,
        answer: data.answer,
        isCorrect: data.isCorrect,
        submittedAt: new Date('2026-04-02T10:00:00.000Z'),
      }),
    );
  }

  private async ensurePayment(data: {
    student: UserEntity;
    amount: number;
    currency: string;
    status: string;
    providerReference: string;
    paidAt: Date;
  }): Promise<PaymentEntity> {
    const existing = await this.paymentsRepository.findOne({
      where: {
        student: { id: data.student.id },
        providerReference: data.providerReference,
      },
    });
    if (existing) {
      return existing;
    }

    return this.paymentsRepository.save(this.paymentsRepository.create(data));
  }

  private _buildPlacementQuestions(): PlacementQuestionJson[] {
    const singleQuestions = Array.from({ length: 20 }).map((_, index) => {
      const number = index + 1;
      const options = JSON.stringify({
        type: 'single',
        options: [
          `I has lesson ${number}.`,
          `I have lesson ${number}.`,
          `I having lesson ${number}.`,
          `I am have lesson ${number}.`,
        ],
      });
      return {
        id: randomUUID(),
        prompt: `Single ${number}: Choose the correct sentence form.`,
        options,
        correctAnswer: `I have lesson ${number}.`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    const multiQuestions = Array.from({ length: 15 }).map((_, index) => {
      const number = index + 1;
      const optionA = `a${number} grammar`;
      const optionB = `b${number} vocabulary`;
      const optionC = `c${number} spelling`;
      const optionD = `d${number} punctuation`;
      const options = JSON.stringify({
        type: 'multi',
        options: [optionA, optionB, optionC, optionD],
      });
      return {
        id: randomUUID(),
        prompt: `Multi ${number}: Select all core language skills.`,
        options,
        correctAnswer: [optionA, optionB, optionC].sort().join('||'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    const textQuestions = Array.from({ length: 15 }).map((_, index) => {
      const number = index + 1;
      const options = JSON.stringify({
        type: 'text',
        options: [],
      });
      return {
        id: randomUUID(),
        prompt: `Text ${number}: Write the past tense of "go".`,
        options,
        correctAnswer: 'went',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    });

    return [...singleQuestions, ...multiQuestions, ...textQuestions];
  }
}
