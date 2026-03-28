import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { AvailabilityEntity } from '../entities/availability.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Availability } from '../../../../domain/availability';
import { AvailabilityRepository } from '../../availability.repository';
import { AvailabilityMapper } from '../mappers/availability.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class AvailabilityRelationalRepository implements AvailabilityRepository {
  constructor(
    @InjectRepository(AvailabilityEntity)
    private readonly availabilityRepository: Repository<AvailabilityEntity>,
  ) {}

  async create(data: Availability): Promise<Availability> {
    const persistenceModel = AvailabilityMapper.toPersistence(data);
    const newEntity = await this.availabilityRepository.save(
      this.availabilityRepository.create(persistenceModel),
    );
    return AvailabilityMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Availability[]> {
    const entities = await this.availabilityRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => AvailabilityMapper.toDomain(entity));
  }

  async findById(id: Availability['id']): Promise<NullableType<Availability>> {
    const entity = await this.availabilityRepository.findOne({
      where: { id },
    });

    return entity ? AvailabilityMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Availability['id'][]): Promise<Availability[]> {
    const entities = await this.availabilityRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => AvailabilityMapper.toDomain(entity));
  }

  async update(
    id: Availability['id'],
    payload: Partial<Availability>,
  ): Promise<Availability> {
    const entity = await this.availabilityRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.availabilityRepository.save(
      this.availabilityRepository.create(
        AvailabilityMapper.toPersistence({
          ...AvailabilityMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return AvailabilityMapper.toDomain(updatedEntity);
  }

  async remove(id: Availability['id']): Promise<void> {
    await this.availabilityRepository.delete(id);
  }
}
