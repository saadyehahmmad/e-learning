import { CoursesModule } from '../courses/courses.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { RelationalQuizPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalQuestionPersistenceModule } from '../questions/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalStudentAnswerPersistenceModule } from '../student-answers/infrastructure/persistence/relational/relational-persistence.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    CoursesModule,
    RelationalQuestionPersistenceModule,
    RelationalStudentAnswerPersistenceModule,

    // do not remove this comment
    RelationalQuizPersistenceModule,
  ],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService, RelationalQuizPersistenceModule],
})
export class QuizzesModule {}
