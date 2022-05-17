// NestJS
import { Controller, Post, Body, Request, Get, UseGuards, Param } from '@nestjs/common';

// Common
import { hasRoles, Role, RolesGuard } from '@yj-major-project/common';

// Other Dependencies
import { ObjectId } from 'mongoose';
import Stripe from 'stripe';

// Custom
// DTOs
import { CreatePaymentDto } from './dto/create-payment.dto';
// Schemas
import { Payment } from './schemas/payment.schema';
// Services
import { PaymentsService } from './payments.service';


@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) { }

  @Post()
  async create(@Request() req, @Body() createPaymentDto: CreatePaymentDto): Promise<Stripe.Checkout.Session> {
    return await this.paymentsService.create(req.user.id, createPaymentDto);
  }

  @Get(':orderId/status')
  async status(@Request() req, @Param('orderId') orderId: ObjectId): Promise<String> {
    const userId = req.user.id;
    return await this.paymentsService.status(userId, orderId);
  } 

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(): Promise<Payment[]> {
    return await this.paymentsService.findAll();
  }
}