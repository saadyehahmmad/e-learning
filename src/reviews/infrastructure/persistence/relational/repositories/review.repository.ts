import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ReviewEntity } from '../entities/review.entity';
import { NullableType } from '../../../../../utils/types/nullable.type';
import { Review } from '../../../../domain/review';
import { ReviewRepository } from '../../review.repository';
import { ReviewMapper } from '../mappers/review.mapper';
import { IPaginationOptions } from '../../../../../utils/types/pagination-options';

@Injectable()
export class ReviewRelationalRepository implements ReviewRepository {
  constructor(
    @InjectRepository(ReviewEntity)
    private readonly reviewRepository: Repository<ReviewEntity>,
  ) {}

  async create(data: Review): Promise<Review> {
    const persistenceModel = ReviewMapper.toPersistence(data);
    const newEntity = await this.reviewRepository.save(
      this.reviewRepository.create(persistenceModel),
    );
    return ReviewMapper.toDomain(newEntity);
  }

  async findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Review[]> {
    const entities = await this.reviewRepository.find({
      skip: (paginationOptions.page - 1) * paginationOptions.limit,
      take: paginationOptions.limit,
    });

    return entities.map((entity) => ReviewMapper.toDomain(entity));
  }

  async findById(id: Review['id']): Promise<NullableType<Review>> {
    const entity = await this.reviewRepository.findOne({
      where: { id },
    });

    return entity ? ReviewMapper.toDomain(entity) : null;
  }

  async findByIds(ids: Review['id'][]): Promise<Review[]> {
    const entities = await this.reviewRepository.find({
      where: { id: In(ids) },
    });

    return entities.map((entity) => ReviewMapper.toDomain(entity));
  }

  async update(id: Review['id'], payload: Partial<Review>): Promise<Review> {
    const entity = await this.reviewRepository.findOne({
      where: { id },
    });

    if (!entity) {
      throw new Error('Record not found');
    }

    const updatedEntity = await this.reviewRepository.save(
      this.reviewRepository.create(
        ReviewMapper.toPersistence({
          ...ReviewMapper.toDomain(entity),
          ...payload,
        }),
      ),
    );

    return ReviewMapper.toDomain(updatedEntity);
  }

  async remove(id: Review['id']): Promise<void> {
    await this.reviewRepository.delete(id);
  }
}
