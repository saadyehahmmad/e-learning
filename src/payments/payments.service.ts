import { UsersService } from '../users/users.service';
import { User } from '../users/domain/user';

import {
  Injectable,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentRepository } from './infrastructure/persistence/payment.repository';
import { IPaginationOptions } from '../utils/types/pagination-options';
import { Payment } from './domain/payment';
/**
 * Persists student payments without requiring course enrollment (Fluentia admin model).
 */
@Injectable()
export class PaymentsService {
  constructor(
    private readonly userService: UsersService,
    private readonly paymentRepository: PaymentRepository,
  ) {}

  /**
   * Creates a payment from an admin payload (student reference only).
   */
  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
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

    return this.paymentRepository.create({
      student: studentObject,
      amount: createPaymentDto.amount,
      currency: createPaymentDto.currency.toUpperCase(),
      providerReference: createPaymentDto.providerReference ?? null,
      status: createPaymentDto.status,
      paidAt: createPaymentDto.paidAt ?? new Date(),
    });
  }

  /**
   * Creates a payment linked only to a student (no enrollment row).
   */
  async createForStudent(
    studentId: number,
    data: {
      amount: number;
      currency: string;
      status: string;
      paidAt?: Date | null;
      providerReference?: string | null;
    },
  ): Promise<Payment> {
    const studentObject = await this.userService.findById(studentId);
    if (!studentObject) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          student: 'notExists',
        },
      });
    }

    return this.paymentRepository.create({
      student: studentObject,
      amount: data.amount,
      currency: data.currency.toUpperCase(),
      providerReference: data.providerReference ?? null,
      status: data.status,
      paidAt: data.paidAt ?? new Date(),
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

  findAllByStudentId(studentId: number): Promise<Payment[]> {
    return this.paymentRepository.findAllByStudentId(studentId);
  }

  async update(
    id: Payment['id'],

    updatePaymentDto: UpdatePaymentDto,
  ) {
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

    return this.paymentRepository.update(id, {
      paidAt: updatePaymentDto.paidAt,

      providerReference: updatePaymentDto.providerReference,

      status: updatePaymentDto.status,

      currency: updatePaymentDto.currency,

      amount: updatePaymentDto.amount,

      student,
    });
  }

  remove(id: Payment['id']) {
    return this.paymentRepository.remove(id);
  }
}
