import { Module } from '@nestjs/common';
import { StudentAnswerRepository } from '../student-answer.repository';
import { StudentAnswerRelationalRepository } from './repositories/student-answer.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StudentAnswerEntity } from './entities/student-answer.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StudentAnswerEntity])],
  providers: [
    {
      provide: StudentAnswerRepository,
      useClass: StudentAnswerRelationalRepository,
    },
  ],
  exports: [StudentAnswerRepository],
})
export class RelationalStudentAnswerPersistenceModule {}
