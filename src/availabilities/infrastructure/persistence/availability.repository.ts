import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Availability } from '../../domain/availability';

export abstract class AvailabilityRepository {
  abstract create(
    data: Omit<Availability, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Availability>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Availability[]>;

  abstract findById(
    id: Availability['id'],
  ): Promise<NullableType<Availability>>;

  abstract findByIds(ids: Availability['id'][]): Promise<Availability[]>;

  abstract update(
    id: Availability['id'],
    payload: DeepPartial<Availability>,
  ): Promise<Availability | null>;

  abstract remove(id: Availability['id']): Promise<void>;
}
