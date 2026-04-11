import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../users/infrastructure/persistence/relational/entities/user.entity';
import { StudentGroupEntity } from '../student-groups/infrastructure/persistence/relational/entities/student-group.entity';
import { StudentGroupsModule } from '../student-groups/student-groups.module';
import { UsersModule } from '../users/users.module';
import { PlacementModule } from '../placement/placement.module';
import { RelationalStudentAnswerPersistenceModule } from '../student-answers/infrastructure/persistence/relational/relational-persistence.module';
import { PaymentsModule } from '../payments/payments.module';
import { AdminDashboardService } from './admin-dashboard.service';
import { AdminDashboardController } from './admin-dashboard.controller';
import { AdminHubController } from './admin-hub.controller';
import { AdminGroupsService } from './admin-groups.service';
import { AdminGroupsController } from './admin-groups.controller';
import { AdminPlacementService } from './admin-placement.service';
import { AdminPlacementController } from './admin-placement.controller';
import { AdminStudentsService } from './admin-students.service';
import { AdminStudentsController } from './admin-students.controller';
import { AdminHubBundleService } from './admin-hub-bundle.service';
import { AdminHubBundleController } from './admin-hub-bundle.controller';

/**
 * Fluentia admin HTTP API (`/api/v1/admin/*`).
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, StudentGroupEntity]),
    StudentGroupsModule,
    UsersModule,
    PlacementModule,
    RelationalStudentAnswerPersistenceModule,
    PaymentsModule,
  ],
  controllers: [
    AdminDashboardController,
    AdminHubController,
    AdminHubBundleController,
    AdminGroupsController,
    AdminPlacementController,
    AdminStudentsController,
  ],
  providers: [
    AdminDashboardService,
    AdminHubBundleService,
    AdminGroupsService,
    AdminPlacementService,
    AdminStudentsService,
  ],
  exports: [AdminStudentsService],
})
export class AdminModule {}
