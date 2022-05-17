// NestJS
import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ClientProxy } from '@nestjs/microservices';

// Common
import { OrderStatus, PaymentStatus } from '@yj-major-project/common';

// Other Dependencies
import { Model, ObjectId } from 'mongoose';
import axios from 'axios';
import Stripe from 'stripe';

// Custom
// DTOs
import { CreatePaymentDto } from './dto/create-payment.dto';
// Schemas
import { Payment, PaymentDocument } from './schemas/payment.schema';
// Services
import { OrdersService } from '../orders/orders.service';


@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<PaymentDocument>,
    @Inject('PAYMENTS_ORDERS_SERVICE') private readonly client: ClientProxy,
    private readonly ordersService: OrdersService
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27'
    });
  }

  async create(userId: ObjectId, createPaymentDto: CreatePaymentDto): Promise<Stripe.Checkout.Session> {
    const { orderId } = createPaymentDto;

    const order = await this.ordersService.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.userId != userId) {
      throw new UnauthorizedException('You are not authorized to pay for this order');
    }
    if (order.orderStatus == OrderStatus.Canceled) {
      throw new BadRequestException('Cannot pay for an canceled order');
    }

    const session = await this.stripe.checkout.sessions.create({
      line_items: order.items.map((item) => ({
        price_data: {
          currency: 'inr',
          product_data: {
            // @ts-ignore
            name: item.name,
          },
          // @ts-ignore
          unit_amount: Math.round(item.price * (1 - (item.discount / 100))) * 100,
        },
        // @ts-ignore
        quantity: item.quantity
      })),
      mode: 'payment',
      success_url: `${process.env.BASE_URL}/orders/${orderId}?success=true`,
      cancel_url: `${process.env.BASE_URL}/orders/${orderId}?canceled=true`,
    });

    const createdPayment = new this.paymentModel({
      userId,
      orderId,
      checkoutSession: session.id,
      paymentIntent: session.payment_intent
    });
    await createdPayment.save();

    return session;
  }

  async status(userId: ObjectId, orderId: ObjectId): Promise<String> {
    const order = await this.ordersService.findById(orderId);

    if (!order) {
      throw new NotFoundException('Order not found');
    }
    if (order.userId != userId) {
      throw new UnauthorizedException();
    }

    const payment = await this.paymentModel.findOne({
      orderId
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    const res = await axios.get(`https://api.stripe.com/v1/checkout/sessions/${payment.checkoutSession}`, { headers: { Authorization: 'Bearer ' + process.env.STRIPE_SECRET_KEY } });
    const checkoutSession = await res.data;

    if (checkoutSession.payment_status === "paid") {
      await this.paymentModel.findOneAndUpdate({
        orderId
      }, {
        status: PaymentStatus.Paid
      });
      this.client.emit('paymentSucceeded', order._id);
      return "Success";
    } else {
      await this.paymentModel.findOneAndUpdate({
        orderId
      }, {
        status: PaymentStatus.Failed
      });
      this.client.emit('paymentFailed', order._id);
      return "Failed";
    }
  }

  async findAll(): Promise<Payment[]> {
    return await this.paymentModel.find().exec();
  }
}