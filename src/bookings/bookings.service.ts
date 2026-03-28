import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { BookingRepository } from './infrastructure/persistence/booking.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Booking } from './domain/booking';

@Injectable()
export class BookingsService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly bookingRepository: BookingRepository,
  ) {}

  async create(createBookingDto: CreateBookingDto) {
    // Do not remove comment below.
    // <creating-property />
    const tutorObject = await this.userService.findById(
      createBookingDto.tutor.id,
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

    const studentObject = await this.userService.findById(
      createBookingDto.student.id,
    );
    if (!studentObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          student: 'notExists',
        },
      });
    }
    const student = studentObject;

    return this.bookingRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      tutor,

      student,

      status: createBookingDto.status,

      startTime: createBookingDto.startTime,

      bookingDate: createBookingDto.bookingDate,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.bookingRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Booking['id']) {
    return this.bookingRepository.findById(id);
  }

  findByIds(ids: Booking['id'][]) {
    return this.bookingRepository.findByIds(ids);
  }

  async update(
    id: Booking['id'],

    updateBookingDto: UpdateBookingDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let tutor: User | undefined = undefined;

    if (updateBookingDto.tutor) {
      const tutorObject = await this.userService.findById(
        updateBookingDto.tutor.id,
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

    let student: User | undefined = undefined;

    if (updateBookingDto.student) {
      const studentObject = await this.userService.findById(
        updateBookingDto.student.id,
      );
      if (!studentObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            student: 'notExists',
          },
        });
      }
      student = studentObject;
    }

    return this.bookingRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      tutor,

      student,

      status: updateBookingDto.status,

      startTime: updateBookingDto.startTime,

      bookingDate: updateBookingDto.bookingDate,
    });
  }

  remove(id: Booking['id']) {
    return this.bookingRepository.remove(id);
  }
}
