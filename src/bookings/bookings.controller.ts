import {
  ForbiddenException,
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
  NotFoundException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Booking } from './domain/booking';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllBookingsDto } from './dto/find-all-bookings.dto';
import { Roles } from '../roles/roles.decorator';
import { RoleEnum } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { EnrollmentsService } from '../enrollments/enrollments.service';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'bookings',
  version: '1',
})
export class BookingsController {
  constructor(
    private readonly bookingsService: BookingsService,
    private readonly enrollmentsService: EnrollmentsService,
  ) {}

  @Post()
  @Roles(RoleEnum.admin, RoleEnum.tutor)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiCreatedResponse({
    type: Booking,
  })
  async create(@Request() request, @Body() createBookingDto: CreateBookingDto) {
    await this._assertCreatePolicy(request, createBookingDto);
    return this.bookingsService.create(createBookingDto);
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Booking),
  })
  async findAll(
    @Request() request,
    @Query() query: FindAllBookingsDto,
  ): Promise<InfinityPaginationResponseDto<Booking>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    const bookings = await this.bookingsService.findAllWithPagination({
      paginationOptions: {
        page,
        limit,
      },
    });
    const actorRoleId = Number(request.user?.role?.id);
    const actorId = request.user?.id;
    const scopedBookings =
      actorRoleId === RoleEnum.tutor
        ? bookings.filter((booking) => String(booking.tutor?.id) === String(actorId))
        : actorRoleId === RoleEnum.student
          ? bookings.filter(
              (booking) => String(booking.student?.id) === String(actorId),
            )
          : bookings;

    return infinityPagination(scopedBookings, { page, limit });
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Booking,
  })
  async findById(@Request() request, @Param('id') id: string) {
    const booking = await this.bookingsService.findById(id);
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    this._assertAccessPolicy(request, booking);
    return booking;
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Booking,
  })
  async update(
    @Request() request,
    @Param('id') id: string,
    @Body() updateBookingDto: UpdateBookingDto,
  ) {
    const existingBooking = await this.bookingsService.findById(id);
    if (!existingBooking) {
      throw new NotFoundException('Booking not found');
    }
    this._assertAccessPolicy(request, existingBooking);

    return this.bookingsService.update(id, updateBookingDto);
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
    const existingBooking = await this.bookingsService.findById(id);
    if (!existingBooking) {
      throw new NotFoundException('Booking not found');
    }
    this._assertAccessPolicy(request, existingBooking);

    return this.bookingsService.remove(id);
  }

  /**
   * Enforces tutor-driven one-to-one booking creation policy.
   */
  private async _assertCreatePolicy(request, createBookingDto: CreateBookingDto) {
    const actorRoleId = Number(request.user?.role?.id);
    const actorId = request.user?.id;
    if (actorRoleId === RoleEnum.tutor) {
      if (String(createBookingDto.tutor.id) !== String(actorId)) {
        throw new ForbiddenException(
          'Tutor can only create appointments using their own account.',
        );
      }

      const enrollments = await this.enrollmentsService.findAllWithPagination({
        paginationOptions: {
          page: 1,
          limit: 200,
        },
      });
      const hasTutorStudentRelation = enrollments.some(
        (enrollment) =>
          String(enrollment.student?.id) === String(createBookingDto.student.id) &&
          String(enrollment.course?.tutor?.id) === String(actorId),
      );
      if (!hasTutorStudentRelation) {
        throw new ForbiddenException(
          'Tutor can only create appointments for assigned students.',
        );
      }
    }
  }

  /**
   * Enforces per-role booking access policy.
   */
  private _assertAccessPolicy(request, booking: Booking) {
    const actorRoleId = Number(request.user?.role?.id);
    const actorId = request.user?.id;

    if (actorRoleId === RoleEnum.admin) {
      return;
    }
    if (
      actorRoleId === RoleEnum.tutor &&
      String(booking.tutor?.id) !== String(actorId)
    ) {
      throw new ForbiddenException('Tutors can only access their own bookings.');
    }
    if (
      actorRoleId === RoleEnum.student &&
      String(booking.student?.id) !== String(actorId)
    ) {
      throw new ForbiddenException('Students can only access their own bookings.');
    }
  }
}
