import { CoursesModule } from '../courses/courses.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { RelationalLessonPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    CoursesModule,

    // do not remove this comment
    RelationalLessonPersistenceModule,
  ],
  controllers: [LessonsController],
  providers: [LessonsService],
  exports: [LessonsService, RelationalLessonPersistenceModule],
})
export class LessonsModule {}
