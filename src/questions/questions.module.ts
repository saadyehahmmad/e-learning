import { QuizzesModule } from '../quizzes/quizzes.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { QuestionsController } from './questions.controller';
import { RelationalQuestionPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    QuizzesModule,

    // do not remove this comment
    RelationalQuestionPersistenceModule,
  ],
  controllers: [QuestionsController],
  providers: [QuestionsService],
  exports: [QuestionsService, RelationalQuestionPersistenceModule],
})
export class QuestionsModule {}
