import { CoursesService } from '../courses/courses.service';
import { Course } from '../courses/domain/course';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { LessonRepository } from './infrastructure/persistence/lesson.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Lesson } from './domain/lesson';

@Injectable()
export class LessonsService {
  constructor(
    private readonly courseService: CoursesService,

    // Dependencies here
    private readonly lessonRepository: LessonRepository,
  ) {}

  async create(createLessonDto: CreateLessonDto) {
    // Do not remove comment below.
    // <creating-property />
    const courseObject = await this.courseService.findById(
      createLessonDto.course.id,
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

    return this.lessonRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      course,

      lessonOrder: createLessonDto.lessonOrder,

      videoUrl: createLessonDto.videoUrl,

      content: createLessonDto.content,

      title: createLessonDto.title,
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.lessonRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Lesson['id']) {
    return this.lessonRepository.findById(id);
  }

  findByIds(ids: Lesson['id'][]) {
    return this.lessonRepository.findByIds(ids);
  }

  async update(
    id: Lesson['id'],

    updateLessonDto: UpdateLessonDto,
  ) {
    // Do not remove comment below.
    // <updating-property />
    let course: Course | undefined = undefined;

    if (updateLessonDto.course) {
      const courseObject = await this.courseService.findById(
        updateLessonDto.course.id,
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

    return this.lessonRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      course,

      lessonOrder: updateLessonDto.lessonOrder,

      videoUrl: updateLessonDto.videoUrl,

      content: updateLessonDto.content,

      title: updateLessonDto.title,
    });
  }

  remove(id: Lesson['id']) {
    return this.lessonRepository.remove(id);
  }
}
