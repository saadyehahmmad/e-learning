import { Module } from '@nestjs/common';
import { StudentAnswerRepository } from '../student-answer.repository';
import { StudentAnswerRelationalRepository } from './repositories/student-answer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentAnswerEntity } from './entities/student-answer.entity';
import { PlacementEntity } from '../../../../placement/infrastructure/persistence/relational/entities/placement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentAnswerEntity, PlacementEntity])],
  providers: [
    {
      provide: StudentAnswerRepository,
      useClass: StudentAnswerRelationalRepository,
    },
  ],
  exports: [StudentAnswerRepository],
})
export class RelationalStudentAnswerPersistenceModule {}
