import { UsersModule } from '../users/users.module';
import { EnrollmentsModule } from '../enrollments/enrollments.module';
import {
  // do not remove this comment
  Module,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { RelationalBookingPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
  imports: [
    UsersModule,
    EnrollmentsModule,

    // do not remove this comment
    RelationalBookingPersistenceModule,
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService, RelationalBookingPersistenceModule],
})
export class BookingsModule {}
