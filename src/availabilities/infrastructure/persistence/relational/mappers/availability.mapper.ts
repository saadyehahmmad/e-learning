import { Availability } from '../../../../domain/availability';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { AvailabilityEntity } from '../entities/availability.entity';

export class AvailabilityMapper {
  static toDomain(raw: AvailabilityEntity): Availability {
    const domainEntity = new Availability();
    if (raw.tutor) {
      domainEntity.tutor = UserMapper.toDomain(raw.tutor);
    }

    domainEntity.endTime = raw.endTime;

    domainEntity.startTime = raw.startTime;

    domainEntity.dayOfWeek = raw.dayOfWeek;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Availability): AvailabilityEntity {
    const persistenceEntity = new AvailabilityEntity();
    if (domainEntity.tutor) {
      persistenceEntity.tutor = UserMapper.toPersistence(domainEntity.tutor);
    }

    persistenceEntity.endTime = domainEntity.endTime;

    persistenceEntity.startTime = domainEntity.startTime;

    persistenceEntity.dayOfWeek = domainEntity.dayOfWeek;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
