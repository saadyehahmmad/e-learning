import { DeepPartial } from '../../../utils/types/deep-partial.type';
import { NullableType } from '../../../utils/types/nullable.type';
import { IPaginationOptions } from '../../../utils/types/pagination-options';
import { Placement } from '../../domain/placement';

export abstract class PlacementRepository {
  abstract create(
    data: Omit<Placement, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Placement>;

  abstract findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }): Promise<Placement[]>;

  abstract findById(id: Placement['id']): Promise<NullableType<Placement>>;

  abstract findPlacementTest(): Promise<NullableType<Placement>>;

  abstract findByIds(ids: Placement['id'][]): Promise<Placement[]>;

  abstract update(
    id: Placement['id'],
    payload: DeepPartial<Placement>,
  ): Promise<Placement | null>;

  abstract remove(id: Placement['id']): Promise<void>;
}
