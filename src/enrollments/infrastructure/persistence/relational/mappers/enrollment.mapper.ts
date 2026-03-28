import { Enrollment } from '../../../../domain/enrollment';
import { CourseMapper } from '../../../../../courses/infrastructure/persistence/relational/mappers/course.mapper';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { EnrollmentEntity } from '../entities/enrollment.entity';

export class EnrollmentMapper {
  static toDomain(raw: EnrollmentEntity): Enrollment {
    const domainEntity = new Enrollment();
    if (raw.course) {
      domainEntity.course = CourseMapper.toDomain(raw.course);
    }

    if (raw.student) {
      domainEntity.student = UserMapper.toDomain(raw.student);
    }

    domainEntity.progress = raw.progress;

    domainEntity.status = raw.status;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Enrollment): EnrollmentEntity {
    const persistenceEntity = new EnrollmentEntity();
    if (domainEntity.course) {
      persistenceEntity.course = CourseMapper.toPersistence(
        domainEntity.course,
      );
    }

    if (domainEntity.student) {
      persistenceEntity.student = UserMapper.toPersistence(
        domainEntity.student,
      );
    }

    persistenceEntity.progress = domainEntity.progress;

    persistenceEntity.status = domainEntity.status;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
