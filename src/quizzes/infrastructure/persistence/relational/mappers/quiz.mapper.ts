import { Quiz } from '../../../../domain/quiz';
import { CourseMapper } from '../../../../../courses/infrastructure/persistence/relational/mappers/course.mapper';

import { QuizEntity } from '../entities/quiz.entity';

export class QuizMapper {
  static toDomain(raw: QuizEntity): Quiz {
    const domainEntity = new Quiz();
    if (raw.course) {
      domainEntity.course = CourseMapper.toDomain(raw.course);
    }

    domainEntity.passingScore = raw.passingScore;

    domainEntity.description = raw.description;

    domainEntity.title = raw.title;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Quiz): QuizEntity {
    const persistenceEntity = new QuizEntity();
    if (domainEntity.course) {
      persistenceEntity.course = CourseMapper.toPersistence(
        domainEntity.course,
      );
    }

    persistenceEntity.passingScore = domainEntity.passingScore;

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
