import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ELearningSeedService } from './e-learning-seed.service';
import { PlacementEntity } from '../../../../placement/infrastructure/persistence/relational/entities/placement.entity';
import { UserEntity } from '../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { StudentAnswerEntity } from '../../../../student-answers/infrastructure/persistence/relational/entities/student-answer.entity';
import { PaymentEntity } from '../../../../payments/infrastructure/persistence/relational/entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      PlacementEntity,
      StudentAnswerEntity,
      PaymentEntity,
    ]),
  ],
  providers: [ELearningSeedService],
  exports: [ELearningSeedService],
})
export class ELearningSeedModule {}
