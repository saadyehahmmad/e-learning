import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import { EnrollmentsService } from '../enrollments/enrollments.service';
import { Enrollment } from '../enrollments/domain/enrollment';

import {
  // common
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CreateMyPaymentDto } from './dto/create-my-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { PaymentRepository } from './infrastructure/persistence/payment.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Payment } from './domain/payment';
import { PaymentStatusEnum } from './payment-status.enum';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly userService: UsersService,

    private readonly enrollmentService: EnrollmentsService,

    // Dependencies here
    private readonly paymentRepository: PaymentRepository,
  ) {}

  /**
   * Creates a payment record from administrative payload.
   */
  async create(createPaymentDto: CreatePaymentDto) {
    // Do not remove comment below.
    // <creating-property />

    const studentObject = await this.userService.findById(
      createPaymentDto.student.id,
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

    const enrollmentObject = await this.enrollmentService.findById(
      createPaymentDto.enrollment.id,
    );
    if (!enrollmentObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          enrollment: 'notExists',
        },
      });
    }
    const enrollment = enrollmentObject;

    this.ensureEnrollmentOwnedByStudent(enrollment, student.id as number);

    return this.paymentRepository.create({
      // Do not remove comment below.
      // <creating-property-payload />
      paidAt: createPaymentDto.paidAt,

      providerReference: createPaymentDto.providerReference,

      status: createPaymentDto.status,

      currency: createPaymentDto.currency,

      amount: createPaymentDto.amount,

      student,

      enrollment,
    });
  }

  /**
   * Creates a payment for the authenticated student.
   */
  async createForStudent(
    studentId: number,
    createMyPaymentDto: CreateMyPaymentDto,
  ) {
    const studentObject = await this.userService.findById(studentId);
    if (!studentObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          student: 'notExists',
        },
      });
    }

    const enrollmentObject = await this.enrollmentService.findById(
      createMyPaymentDto.enrollmentId,
    );
    if (!enrollmentObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          enrollment: 'notExists',
        },
      });
    }

    this.ensureEnrollmentOwnedByStudent(enrollmentObject, studentId);

    return this.paymentRepository.create({
      student: studentObject,
      enrollment: enrollmentObject,
      amount: createMyPaymentDto.amount,
      currency: createMyPaymentDto.currency.toUpperCase(),
      providerReference: createMyPaymentDto.providerReference ?? null,
      status: PaymentStatusEnum.paid,
      paidAt: new Date(),
    });
  }

  findAllWithPagination({
    paginationOptions,
  }: {
    paginationOptions: IPaginationOptions;
  }) {
    return this.paymentRepository.findAllWithPagination({
      paginationOptions: {
        page: paginationOptions.page,
        limit: paginationOptions.limit,
      },
    });
  }

  findById(id: Payment['id']) {
    return this.paymentRepository.findById(id);
  }

  findByIds(ids: Payment['id'][]) {
    return this.paymentRepository.findByIds(ids);
  }

  /**
   * Returns paginated payments for a specific student.
   */
  findMyPayments(
    studentId: number,
    paginationOptions: IPaginationOptions,
  ): Promise<Payment[]> {
    return this.paymentRepository.findByStudentId(studentId, paginationOptions);
  }

  async update(
    id: Payment['id'],

    updatePaymentDto: UpdatePaymentDto,
  ) {
    // Do not remove comment below.
    // <updating-property />

    let student: User | undefined = undefined;

    if (updatePaymentDto.student) {
      const studentObject = await this.userService.findById(
        updatePaymentDto.student.id,
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

    let enrollment: Enrollment | undefined = undefined;

    if (updatePaymentDto.enrollment) {
      const enrollmentObject = await this.enrollmentService.findById(
        updatePaymentDto.enrollment.id,
      );
      if (!enrollmentObject) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            enrollment: 'notExists',
          },
        });
      }
      enrollment = enrollmentObject;
    }

    return this.paymentRepository.update(id, {
      // Do not remove comment below.
      // <updating-property-payload />
      paidAt: updatePaymentDto.paidAt,

      providerReference: updatePaymentDto.providerReference,

      status: updatePaymentDto.status,

      currency: updatePaymentDto.currency,

      amount: updatePaymentDto.amount,

      student,

      enrollment,
    });
  }

  remove(id: Payment['id']) {
    return this.paymentRepository.remove(id);
  }

  /**
   * Validates that the enrollment belongs to the expected student.
   */
  private ensureEnrollmentOwnedByStudent(
    enrollment: Enrollment,
    studentId: number,
  ): void {
    if (Number(enrollment.student?.id) !== Number(studentId)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          enrollment: 'notOwnedByStudent',
        },
      });
    }
  }
}
