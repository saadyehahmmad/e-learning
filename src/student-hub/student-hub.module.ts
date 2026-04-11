import { Module } from '@nestjs/common';
import { AdminModule } from '../admin/admin.module';
import { PlacementModule } from '../placement/placement.module';
import { StudentController } from './student.controller';
import { PlacementSubmitController } from './placement-submit.controller';
import { StudentPlacementService } from './student-placement.service';

/**
 * Student-facing routes (`/api/v1/student/*`, `/api/v1/placement/*`): hub, placement exam, submit.
 */
@Module({
  imports: [AdminModule, PlacementModule],
  controllers: [StudentController, PlacementSubmitController],
  providers: [StudentPlacementService],
})
export class StudentHubModule {}
