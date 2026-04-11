import { Payment } from '../../../../domain/payment';

import { UserMapper } from '../../../../../users/infrastructure/persistence/relational/mappers/user.mapper';

import { PaymentEntity } from '../entities/payment.entity';

export class PaymentMapper {
  static toDomain(raw: PaymentEntity): Payment {
    const domainEntity = new Payment();
    domainEntity.paidAt = raw.paidAt;

    domainEntity.providerReference = raw.providerReference;

    domainEntity.status = raw.status;

    domainEntity.currency = raw.currency;

    domainEntity.amount = raw.amount;

    if (raw.student) {
      domainEntity.student = UserMapper.toDomain(raw.student);
    }

    domainEntity.id = raw.id;
    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: Payment): PaymentEntity {
    const persistenceEntity = new PaymentEntity();
    persistenceEntity.paidAt = domainEntity.paidAt;

    persistenceEntity.providerReference = domainEntity.providerReference;

    persistenceEntity.status = domainEntity.status;

    persistenceEntity.currency = domainEntity.currency;

    persistenceEntity.amount = domainEntity.amount;

    if (domainEntity.student) {
      persistenceEntity.student = UserMapper.toPersistence(
        domainEntity.student,
      );
    }

    if (domainEntity.id) {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.createdAt = domainEntity.createdAt;
    persistenceEntity.updatedAt = domainEntity.updatedAt;

    return persistenceEntity;
  }
}
