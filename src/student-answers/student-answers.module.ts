import { QuizzesModule } from '../quizzes/quizzes.module';
import { QuestionsModule } from '../questions/questions.module';
import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { StudentAnswersService } from './student-answers.service';
import { StudentAnswersController } from './student-answers.controller';
import { RelationalStudentAnswerPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    QuizzesModule,

    QuestionsModule,

    UsersModule,

    // do not remove this comment
    RelationalStudentAnswerPersistenceModule,
  ],
  controllers: [StudentAnswersController],
  providers: [StudentAnswersService],
  exports: [StudentAnswersService, RelationalStudentAnswerPersistenceModule],
})
export class StudentAnswersModule {}
