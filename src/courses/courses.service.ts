import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CourseRepository } from './infrastructure/persistence/course.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Course } from './domain/course';

@Injectable()
export class CoursesService {
  constructor(
    private readonly userService: UsersService,

    // Dependencies here
    private readonly courseRepository: CourseRepository,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    // Do not remove comment below.
    // <creating-property />
    const tutorObject = await this.userService.findById(
      createCourseDto.tutor.id,
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

    return this.courseRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      tutor,

      price: createCourseDto.price,

      level: createCourseDto.level,

      description: createCourseDto.description,

      title: createCourseDto.title,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.courseRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Course['id']) {
    return this.courseRepository.findById(id);
  }

  findByIds(ids: Course['id'][]) {
    return this.courseRepository.findByIds(ids);
  }

  async update(
    id: Course['id'],

    updateCourseDto: UpdateCourseDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let tutor: User | undefined = undefined;

    if (updateCourseDto.tutor) {
      const tutorObject = await this.userService.findById(
        updateCourseDto.tutor.id,
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

    return this.courseRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      tutor,

      price: updateCourseDto.price,

      level: updateCourseDto.level,

      description: updateCourseDto.description,

      title: updateCourseDto.title,
    });
  }

  remove(id: Course['id']) {
    return this.courseRepository.remove(id);
  }
}
