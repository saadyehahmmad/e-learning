import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewRepository } from './infrastructure/persistence/review.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Review } from './domain/review';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly reviewRepository: ReviewRepository,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    // Do not remove comment below.
    // <creating-property />
    const reviewerObject = await this.userService.findById(
      createReviewDto.reviewer.id,
    );
    if (!reviewerObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          reviewer: 'notExists',
        },
      });
    }
    const reviewer = reviewerObject;

    return this.reviewRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      reviewer,

      targetType: createReviewDto.targetType,

      comment: createReviewDto.comment,

      rating: createReviewDto.rating,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.reviewRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Review['id']) {
    return this.reviewRepository.findById(id);
  }

  findByIds(ids: Review['id'][]) {
    return this.reviewRepository.findByIds(ids);
  }

  async update(
    id: Review['id'],

    updateReviewDto: UpdateReviewDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let reviewer: User | undefined = undefined;

    if (updateReviewDto.reviewer) {
      const reviewerObject = await this.userService.findById(
        updateReviewDto.reviewer.id,
      );
      if (!reviewerObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            reviewer: 'notExists',
          },
        });
      }
      reviewer = reviewerObject;
    }

    return this.reviewRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      reviewer,

      targetType: updateReviewDto.targetType,

      comment: updateReviewDto.comment,

      rating: updateReviewDto.rating,
    });
  }

  remove(id: Review['id']) {
    return this.reviewRepository.remove(id);
  }
}
