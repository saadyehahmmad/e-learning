import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { RelationalPlacementPersistenceModule } from './infrastructure/persistence/relational/relational-placement-persistence.module';
import { RelationalStudentAnswerPersistenceModule } from '../student-answers/infrastructure/persistence/relational/relational-persistence.module';
import { PlacementService } from './placement.service';

/**
 * Placement test aggregate (single table + JSONB questions) and submission logic.
 */
@Module({
  imports: [
    RelationalPlacementPersistenceModule,
    RelationalStudentAnswerPersistenceModule,
    UsersModule,
  ],
  providers: [PlacementService],
  exports: [PlacementService, RelationalPlacementPersistenceModule],
})
export class PlacementModule {}
