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
import { EnrollmentsService } from './enrollments.service';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Enrollment } from './domain/enrollment';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllEnrollmentsDto } from './dto/find-all-enrollments.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { CoursesService } from '../courses/courses.service';

@ApiTags('Enrollments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'enrollments',
  version: '1',
})
export class EnrollmentsController {
  constructor(
    private readonly enrollmentsService: EnrollmentsService,
    private readonly coursesService: CoursesService,
  ) {}

  @Post()
  @Roles(RoleEnum.admin, RoleEnum.tutor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiCreatedResponse({
    type: Enrollment,
  })
  async create(
    @Request() request,
    @Body() createEnrollmentDto: CreateEnrollmentDto,
  ) {
    const actorRoleId = Number(request.user?.role?.id);
    const actorId = request.user?.id;

    if (actorRoleId === RoleEnum.tutor) {
      const course = await this.coursesService.findById(createEnrollmentDto.course.id);
      if (!course || String(course.tutor?.id) !== String(actorId)) {
        throw new ForbiddenException(
          'Tutors can only assign students to their own courses.',
        );
      }
    }

    return this.enrollmentsService.create(createEnrollmentDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Enrollment),
  })
  async findAll(
    @Query() query: FindAllEnrollmentsDto,
  ): Promise<InfinityPaginationResponseDto<Enrollment>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.enrollmentsService.findAllWithPagination({
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
    type: Enrollment,
  })
  findById(@Param('id') id: string) {
    return this.enrollmentsService.findById(id);
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
    type: Enrollment,
  })
  update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    return this._authorizeAndUpdate(request, id, updateEnrollmentDto);
  }

  /**
   * Enforces role-based enrollment update policy before persisting.
   */
  private async _authorizeAndUpdate(
    request,
    id: string,
    updateEnrollmentDto: UpdateEnrollmentDto,
  ) {
    const actorRoleId = Number(request.user?.role?.id);
    const actorId = request.user?.id;

    if (actorRoleId === RoleEnum.tutor) {
      const existingEnrollment = await this.enrollmentsService.findById(id);
      if (!existingEnrollment) {
        throw new NotFoundException('Enrollment not found');
      }

      if (String(existingEnrollment.course?.tutor?.id) !== String(actorId)) {
        throw new ForbiddenException(
          'Tutors can only update enrollments within their own courses.',
        );
      }

      if (updateEnrollmentDto.course?.id) {
        const targetCourse = await this.coursesService.findById(
          updateEnrollmentDto.course.id,
        );
        if (!targetCourse || String(targetCourse.tutor?.id) !== String(actorId)) {
          throw new ForbiddenException(
            'Tutors can only reassign enrollments to their own courses.',
          );
        }
      }
    }

    return this.enrollmentsService.update(id, updateEnrollmentDto);
  }

  @Delete(':id')
  @Roles(RoleEnum.admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.enrollmentsService.remove(id);
  }
}
