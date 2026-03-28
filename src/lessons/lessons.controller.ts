import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Lesson } from './domain/lesson';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllLessonsDto } from './dto/find-all-lessons.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { CoursesService } from '../courses/courses.service';

@ApiTags('Lessons')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'lessons',
  version: '1',
})
export class LessonsController {
  constructor(
    private readonly lessonsService: LessonsService,
    private readonly coursesService: CoursesService,
  ) {}

  @Post()
  @Roles(RoleEnum.admin, RoleEnum.tutor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiCreatedResponse({
    type: Lesson,
  })
  async create(@Request() request, @Body() createLessonDto: CreateLessonDto) {
    await this._assertTutorOwnsCourseIfNeeded(request, createLessonDto.course.id);
    return this.lessonsService.create(createLessonDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Lesson),
  })
  async findAll(
    @Query() query: FindAllLessonsDto,
  ): Promise<InfinityPaginationResponseDto<Lesson>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.lessonsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Lesson,
  })
  findById(@Param('id') id: string) {
    return this.lessonsService.findById(id);
  }

  @Patch(':id')
  @Roles(RoleEnum.admin, RoleEnum.tutor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Lesson,
  })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateLessonDto: UpdateLessonDto,
  ) {
    await this._assertTutorOwnsLessonIfNeeded(request, id);
    if (updateLessonDto.course?.id) {
      await this._assertTutorOwnsCourseIfNeeded(request, updateLessonDto.course.id);
    }
    return this.lessonsService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin, RoleEnum.tutor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  async remove(@Request() request, @Param('id') id: string) {
    await this._assertTutorOwnsLessonIfNeeded(request, id);
    return this.lessonsService.remove(id);
  }

  /**
   * Ensures tutor can only use own courses for lessons.
   */
  private async _assertTutorOwnsCourseIfNeeded(
    request,
    courseId: string,
  ): Promise<void> {
    const actorRoleId = Number(request.user?.role?.id);
    if (actorRoleId !== RoleEnum.tutor) {
      return;
    }

    const course = await this.coursesService.findById(courseId);
    if (!course) {
      throw new NotFoundException('Course not found');
    }

    if (String(course.tutor?.id) !== String(request.user.id)) {
      throw new ForbiddenException(
        'Tutors can only manage lessons for their own courses.',
      );
    }
  }

  /**
   * Ensures tutor can only mutate own lesson records.
   */
  private async _assertTutorOwnsLessonIfNeeded(
    request,
    lessonId: string,
  ): Promise<void> {
    const actorRoleId = Number(request.user?.role?.id);
    if (actorRoleId !== RoleEnum.tutor) {
      return;
    }

    const lesson = await this.lessonsService.findById(lessonId);
    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    if (String(lesson.course?.tutor?.id) !== String(request.user.id)) {
      throw new ForbiddenException(
        'Tutors can only manage lessons for their own courses.',
      );
    }
  }
}
