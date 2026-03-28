import { Course } from '../../../../domain/course';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { CourseEntity } from '../entities/course.entity';

export class CourseMapper {
  static toDomain(raw: CourseEntity): Course {
    const domainEntity = new Course();
    if (raw.tutor) {
      domainEntity.tutor = UserMapper.toDomain(raw.tutor);
    }

    domainEntity.price = raw.price;

    domainEntity.level = raw.level;

    domainEntity.description = raw.description;

    domainEntity.title = raw.title;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Course): CourseEntity {
    const persistenceEntity = new CourseEntity();
    if (domainEntity.tutor) {
      persistenceEntity.tutor = UserMapper.toPersistence(domainEntity.tutor);
    }

    persistenceEntity.price = domainEntity.price;

    persistenceEntity.level = domainEntity.level;

    persistenceEntity.description = domainEntity.description;

    persistenceEntity.title = domainEntity.title;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
