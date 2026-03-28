import { Module } from '@nestjs/common';
import { AvailabilityRepository } from '../availability.repository';
import { AvailabilityRelationalRepository } from './repositories/availability.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AvailabilityEntity } from './entities/availability.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AvailabilityEntity])],
  providers: [
    {
      provide: AvailabilityRepository,
      useClass: AvailabilityRelationalRepository,
    },
  ],
  exports: [AvailabilityRepository],
})
export class RelationalAvailabilityPersistenceModule {}
