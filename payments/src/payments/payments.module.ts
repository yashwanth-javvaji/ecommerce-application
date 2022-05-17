// NestJS
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ClientsModule, Transport } from '@nestjs/microservices';

// Custom
// Controllers
import { PaymentsController } from './payments.controller';
// Modules
import { OrdersModule } from '../orders/orders.module';
// Schemas
import { Payment, PaymentSchema } from './schemas/payment.schema';
// Services
import { PaymentsService } from './payments.service';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'PAYMENTS_ORDERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://wjdovbpn:boXVmPjKWIlMJ0xaTBqm_5jBgA36EuSg@lionfish.rmq.cloudamqp.com/wjdovbpn'],
          queue: 'payments_orders_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    ]),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    OrdersModule
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService]
})
export class PaymentsModule { }