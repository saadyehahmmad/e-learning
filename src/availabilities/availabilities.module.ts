import { UsersModule } from '../users/users.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { AvailabilitiesService } from './availabilities.service';
import { AvailabilitiesController } from './availabilities.controller';
import { RelationalAvailabilityPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,

    // do not remove this comment
    RelationalAvailabilityPersistenceModule,
  ],
  controllers: [AvailabilitiesController],
  providers: [AvailabilitiesService],
  exports: [AvailabilitiesService, RelationalAvailabilityPersistenceModule],
})
export class AvailabilitiesModule {}
