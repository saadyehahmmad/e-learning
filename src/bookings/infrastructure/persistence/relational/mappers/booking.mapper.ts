import { Booking } from '../../../../domain/booking';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { BookingEntity } from '../entities/booking.entity';

export class BookingMapper {
  static toDomain(raw: BookingEntity): Booking {
    const domainEntity = new Booking();
    if (raw.tutor) {
      domainEntity.tutor = UserMapper.toDomain(raw.tutor);
    }

    if (raw.student) {
      domainEntity.student = UserMapper.toDomain(raw.student);
    }

    domainEntity.status = raw.status;

    domainEntity.startTime = raw.startTime;

    domainEntity.bookingDate = raw.bookingDate;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Booking): BookingEntity {
    const persistenceEntity = new BookingEntity();
    if (domainEntity.tutor) {
      persistenceEntity.tutor = UserMapper.toPersistence(domainEntity.tutor);
    }

    if (domainEntity.student) {
      persistenceEntity.student = UserMapper.toPersistence(
        domainEntity.student,
      );
    }

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.startTime = domainEntity.startTime;

    persistenceEntity.bookingDate = domainEntity.bookingDate;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
