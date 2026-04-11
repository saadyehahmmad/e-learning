import { PlacementModule } from '../placement/placement.module';
import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { StudentAnswersService } from './student-answers.service';
import { RelationalStudentAnswerPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    PlacementModule,

    UsersModule,

    // do not remove this comment
    RelationalStudentAnswerPersistenceModule,
  ],
  providers: [StudentAnswersService],
  exports: [StudentAnswersService, RelationalStudentAnswerPersistenceModule],
})
export class StudentAnswersModule {}
