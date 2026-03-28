import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ELearningSeedService } from './e-learning-seed.service';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      CourseEntity,
      LessonEntity,
      EnrollmentEntity,
      AvailabilityEntity,
      BookingEntity,
      ReviewEntity,
      QuizEntity,
      QuestionEntity,
      StudentAnswerEntity,
      PaymentEntity,
    ]),
  ],
  providers: [ELearningSeedService],
  exports: [ELearningSeedService],
})
export class ELearningSeedModule {}
