import { Lesson } from '../../../../domain/lesson';
import { CourseMapper } from '../../../../../courses/infrastructure/persistence/relational/mappers/course.mapper';

import { LessonEntity } from '../entities/lesson.entity';

export class LessonMapper {
  static toDomain(raw: LessonEntity): Lesson {
    const domainEntity = new Lesson();
    if (raw.course) {
      domainEntity.course = CourseMapper.toDomain(raw.course);
    }

    domainEntity.lessonOrder = raw.lessonOrder;

    domainEntity.videoUrl = raw.videoUrl;

    domainEntity.content = raw.content;

    domainEntity.title = raw.title;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Lesson): LessonEntity {
    const persistenceEntity = new LessonEntity();
    if (domainEntity.course) {
      persistenceEntity.course = CourseMapper.toPersistence(
        domainEntity.course,
      );
    }

    persistenceEntity.lessonOrder = domainEntity.lessonOrder;

    persistenceEntity.videoUrl = domainEntity.videoUrl;

    persistenceEntity.content = domainEntity.content;

    persistenceEntity.title = domainEntity.title;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
