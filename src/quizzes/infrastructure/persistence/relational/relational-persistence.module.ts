import { Module } from '@nestjs/common';
import { QuizRepository } from '../quiz.repository';
import { QuizRelationalRepository } from './repositories/quiz.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizEntity } from './entities/quiz.entity';

@Module({
  imports: [TypeOrmModule.forFeature([QuizEntity])],
  providers: [
    {
      provide: QuizRepository,
      useClass: QuizRelationalRepository,
    },
  ],
  exports: [QuizRepository],
})
export class RelationalQuizPersistenceModule {}
