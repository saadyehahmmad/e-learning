import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateAvailabilityDto } from './dto/create-availability.dto';
import { UpdateAvailabilityDto } from './dto/update-availability.dto';
import { AvailabilityRepository } from './infrastructure/persistence/availability.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Availability } from './domain/availability';

@Injectable()
export class AvailabilitiesService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly availabilityRepository: AvailabilityRepository,
  ) {}

  async create(createAvailabilityDto: CreateAvailabilityDto) {
    // Do not remove comment below.
    // <creating-property />
    const tutorObject = await this.userService.findById(
      createAvailabilityDto.tutor.id,
    );
    if (!tutorObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          tutor: 'notExists',
        },
      });
    }
    const tutor = tutorObject;

    return this.availabilityRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      tutor,

      endTime: createAvailabilityDto.endTime,

      startTime: createAvailabilityDto.startTime,

      dayOfWeek: createAvailabilityDto.dayOfWeek,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.availabilityRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Availability['id']) {
    return this.availabilityRepository.findById(id);
  }

  findByIds(ids: Availability['id'][]) {
    return this.availabilityRepository.findByIds(ids);
  }

  async update(
    id: Availability['id'],

    updateAvailabilityDto: UpdateAvailabilityDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let tutor: User | undefined = undefined;

    if (updateAvailabilityDto.tutor) {
      const tutorObject = await this.userService.findById(
        updateAvailabilityDto.tutor.id,
      );
      if (!tutorObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            tutor: 'notExists',
          },
        });
      }
      tutor = tutorObject;
    }

    return this.availabilityRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      tutor,

      endTime: updateAvailabilityDto.endTime,

      startTime: updateAvailabilityDto.startTime,

      dayOfWeek: updateAvailabilityDto.dayOfWeek,
    });
  }

  remove(id: Availability['id']) {
    return this.availabilityRepository.remove(id);
  }
}
