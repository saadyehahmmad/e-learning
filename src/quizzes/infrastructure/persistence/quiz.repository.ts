import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Quiz } from '../../domain/quiz';

export abstract class QuizRepository {
  abstract create(
    data: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Quiz>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Quiz[]>;

  abstract findById(id: Quiz['id']): Promise<NullableType<Quiz>>;

  abstract findByIds(ids: Quiz['id'][]): Promise<Quiz[]>;

  abstract update(
    id: Quiz['id'],
    payload: DeepPartial<Quiz>,
  ): Promise<Quiz | null>;

  abstract remove(id: Quiz['id']): Promise<void>;
}
