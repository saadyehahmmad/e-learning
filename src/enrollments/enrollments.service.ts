import { CoursesService } from '../courses/courses.service';
import { Course } from '../courses/domain/course';

import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { EnrollmentRepository } from './infrastructure/persistence/enrollment.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Enrollment } from './domain/enrollment';

@Injectable()
export class EnrollmentsService {
  constructor(
    private readonly courseService: CoursesService,

    private readonly userService: UsersService,

    // Dependencies here
    private readonly enrollmentRepository: EnrollmentRepository,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    // Do not remove comment below.
    // <creating-property />
    const courseObject = await this.courseService.findById(
      createEnrollmentDto.course.id,
    );
    if (!courseObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          course: 'notExists',
        },
      });
    }
    const course = courseObject;

    const studentObject = await this.userService.findById(
      createEnrollmentDto.student.id,
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

    return this.enrollmentRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      course,

      student,

      progress: createEnrollmentDto.progress,

      status: createEnrollmentDto.status,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.enrollmentRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Enrollment['id']) {
    return this.enrollmentRepository.findById(id);
  }

  findByIds(ids: Enrollment['id'][]) {
    return this.enrollmentRepository.findByIds(ids);
  }

  async update(
    id: Enrollment['id'],

    updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let course: Course | undefined = undefined;

    if (updateEnrollmentDto.course) {
      const courseObject = await this.courseService.findById(
        updateEnrollmentDto.course.id,
      );
      if (!courseObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            course: 'notExists',
          },
        });
      }
      course = courseObject;
    }

    let student: User | undefined = undefined;

    if (updateEnrollmentDto.student) {
      const studentObject = await this.userService.findById(
        updateEnrollmentDto.student.id,
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

    return this.enrollmentRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      course,

      student,

      progress: updateEnrollmentDto.progress,

      status: updateEnrollmentDto.status,
    });
  }

  remove(id: Enrollment['id']) {
    return this.enrollmentRepository.remove(id);
  }
}
