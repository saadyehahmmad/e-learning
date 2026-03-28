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
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Course } from './domain/course';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllCoursesDto } from './dto/find-all-courses.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';

@ApiTags('Courses')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'courses',
  version: '1',
})
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles(RoleEnum.admin, RoleEnum.tutor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiCreatedResponse({
    type: Course,
  })
  create(@Request() request, @Body() createCourseDto: CreateCourseDto) {
    const actorRoleId = Number(request.user?.role?.id);
    if (actorRoleId === RoleEnum.tutor) {
      createCourseDto.tutor = { id: request.user.id } as CreateCourseDto['tutor'];
    }

    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Course),
  })
  async findAll(
    @Query() query: FindAllCoursesDto,
  ): Promise<InfinityPaginationResponseDto<Course>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.coursesService.findAllWithPagination({
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
    type: Course,
  })
  findById(@Param('id') id: string) {
    return this.coursesService.findById(id);
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
    type: Course,
  })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    await this._assertTutorOwnsCourseIfNeeded(request, id);

    const actorRoleId = Number(request.user?.role?.id);
    if (actorRoleId === RoleEnum.tutor && updateCourseDto.tutor) {
      updateCourseDto.tutor = { id: request.user.id } as UpdateCourseDto['tutor'];
    }

    return this.coursesService.update(id, updateCourseDto);
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
    await this._assertTutorOwnsCourseIfNeeded(request, id);
    return this.coursesService.remove(id);
  }

  /**
   * Ensures tutor can only mutate their own courses.
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
      throw new ForbiddenException('Tutors can only manage their own courses.');
    }
  }
}
