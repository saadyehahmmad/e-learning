import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlacementEntity } from './entities/placement.entity';
import { PlacementRepository } from '../placement.repository';
import { PlacementRelationalRepository } from './repositories/placement.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PlacementEntity])],
  providers: [
    {
      provide: PlacementRepository,
      useClass: PlacementRelationalRepository,
    },
  ],
  exports: [PlacementRepository],
})
export class RelationalPlacementPersistenceModule {}
