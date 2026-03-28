import { Review } from '../../../../domain/review';
import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { ReviewEntity } from '../entities/review.entity';

export class ReviewMapper {
  static toDomain(raw: ReviewEntity): Review {
    const domainEntity = new Review();
    if (raw.reviewer) {
      domainEntity.reviewer = UserMapper.toDomain(raw.reviewer);
    }

    domainEntity.targetType = raw.targetType;

    domainEntity.comment = raw.comment;

    domainEntity.rating = raw.rating;

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Review): ReviewEntity {
    const persistenceEntity = new ReviewEntity();
    if (domainEntity.reviewer) {
      persistenceEntity.reviewer = UserMapper.toPersistence(
        domainEntity.reviewer,
      );
    }

    persistenceEntity.targetType = domainEntity.targetType;

    persistenceEntity.comment = domainEntity.comment;

    persistenceEntity.rating = domainEntity.rating;

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
