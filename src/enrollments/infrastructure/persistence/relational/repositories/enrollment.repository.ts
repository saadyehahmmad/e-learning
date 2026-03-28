import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserEntity } from '../../../../../users/infrastructure/persistence/relational/entities/user.entity';
import { EnrollmentEntity } from '../entities/enrollment.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Enrollment } from '../../../../domain/enrollment';
import { EnrollmentRepository } from '../../enrollment.repository';
import { EnrollmentMapper } from '../mappers/enrollment.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class EnrollmentRelationalRepository implements EnrollmentRepository {
  constructor(
    @InjectRepository(EnrollmentEntity)
    private readonly enrollmentRepository: Repository<EnrollmentEntity>,
  ) {}

  async create(data: Enrollment): Promise<Enrollment> {
    const persistenceModel = EnrollmentMapper.toPersistence(data);
    const newEntity = await this.enrollmentRepository.save(
      this.enrollmentRepository.create(persistenceModel),
    );
    const reloaded = await this.enrollmentRepository.findOne({
      where: { id: newEntity.id },
      relations: {
        course: { tutor: true },
        student: true,
      },
      relationLoadStrategy: 'query',
    });
    if (!reloaded) {
      return EnrollmentMapper.toDomain(newEntity);
    }
    await this._hydrateMissingStudents([reloaded]);
    return EnrollmentMapper.toDomain(reloaded);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Enrollment[]> {
    const entities = await this.enrollmentRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
      order: { createdAt: 'DESC' },
      relations: {
        course: { tutor: true },
        student: true,
      },
      relationLoadStrategy: 'query',
    });

    await this._hydrateMissingStudents(entities);

    return entities.map((entity) => EnrollmentMapper.toDomain(entity));
  }

  async findById(id: Enrollment['id']): Promise<NullableType<Enrollment>> {
    const entity = await this.enrollmentRepository.findOne({
      where: { id },
      relations: {
        course: { tutor: true },
        student: true,
      },
      relationLoadStrategy: 'query',
    });

    if (!entity) {
      return null;
    }

    await this._hydrateMissingStudents([entity]);

    return EnrollmentMapper.toDomain(entity);
  }

  async findByIds(ids: Enrollment['id'][]): Promise<Enrollment[]> {
    const entities = await this.enrollmentRepository.find({
      where: { id: In(ids) },
      relations: {
        course: { tutor: true },
        student: true,
      },
      relationLoadStrategy: 'query',
    });

    await this._hydrateMissingStudents(entities);

    return entities.map((entity) => EnrollmentMapper.toDomain(entity));
  }

  async update(
    id: Enrollment['id'],
    payload: Partial<Enrollment>,
  ): Promise<Enrollment> {
    const entity = await this.enrollmentRepository.findOne({
      where: { id },
      relations: {
        course: { tutor: true },
        student: true,
      },
      relationLoadStrategy: 'query',
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    await this._hydrateMissingStudents([entity]);

    const updatedEntity = await this.enrollmentRepository.save(
      this.enrollmentRepository.create(
        EnrollmentMapper.toPersistence({
          ...EnrollmentMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return EnrollmentMapper.toDomain(updatedEntity);
  }

  async remove(id: Enrollment['id']): Promise<void> {
    await this.enrollmentRepository.delete(id);
  }

  /**
   * Loads `student` when the default join omits soft-deleted users or the relation failed to hydrate.
   */
  private async _hydrateMissingStudents(
    entities: EnrollmentEntity[],
  ): Promise<void> {
    const userRepo =
      this.enrollmentRepository.manager.getRepository(UserEntity);

    for (const entity of entities) {
      if (entity.student || entity.studentId == null) {
        continue;
      }

      const found = await userRepo.findOne({
        where: { id: entity.studentId },
        relations: ['role', 'status', 'photo'],
        withDeleted: true,
      });

      if (found) {
        entity.student = found;
      }
    }
  }
}
