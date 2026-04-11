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
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { Payment } from './domain/payment';
import { AuthGuard } from '@nestjs/passport';
import {
  InfinityPaginationResponse,
  InfinityPaginationResponseDto,
} from '../utils/dto/infinity-pagination-response.dto';
import { infinityPagination } from '../utils/infinity-pagination';
import { FindAllPaymentsDto } from './dto/find-all-payments.dto';
import { CreateMyPaymentDto } from './dto/create-my-payment.dto';
import { PaymentStatusEnum } from './payment-status.enum';

@ApiTags('Payments')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller({
  path: 'payments',
  version: '1',
})
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post()
  @ApiCreatedResponse({
    type: Payment,
  })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentsService.create(createPaymentDto);
  }

  @Post('my')
  @ApiCreatedResponse({
    type: Payment,
  })
  createMyPayment(
    @Request() request,
    @Body() createMyPaymentDto: CreateMyPaymentDto,
  ) {
    return this.paymentsService.createForStudent(request.user.id, {
      amount: createMyPaymentDto.amount,
      currency: createMyPaymentDto.currency,
      status: PaymentStatusEnum.paid,
      providerReference: createMyPaymentDto.providerReference ?? null,
    });
  }

  @Get()
  @ApiOkResponse({
    type: InfinityPaginationResponse(Payment),
  })
  async findAll(
    @Query() query: FindAllPaymentsDto,
  ): Promise<InfinityPaginationResponseDto<Payment>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.paymentsService.findAllWithPagination({
        paginationOptions: {
          page,
          limit,
        },
      }),
      { page, limit },
    );
  }

  @Get('my')
  @ApiOkResponse({
    type: InfinityPaginationResponse(Payment),
  })
  async findMyPayments(
    @Request() request,
    @Query() query: FindAllPaymentsDto,
  ): Promise<InfinityPaginationResponseDto<Payment>> {
    const page = query?.page ?? 1;
    let limit = query?.limit ?? 10;
    if (limit > 50) {
      limit = 50;
    }

    return infinityPagination(
      await this.paymentsService.findMyPayments(request.user.id, {
        page,
        limit,
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
    type: Payment,
  })
  findById(@Param('id') id: string) {
    return this.paymentsService.findById(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  @ApiOkResponse({
    type: Payment,
  })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentsService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    type: String,
    required: true,
  })
  remove(@Param('id') id: string) {
    return this.paymentsService.remove(id);
  }
}
