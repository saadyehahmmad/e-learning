import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { RelationalCoursePersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    // do not remove this comment
    RelationalCoursePersistenceModule,
  ],
  controllers: [CoursesController],
  providers: [CoursesService],
  exports: [CoursesService, RelationalCoursePersistenceModule],
})
export class CoursesModule {}
