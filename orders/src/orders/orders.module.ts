// NestJS
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

// Custom
// Contollers
import { OrdersController } from './orders.controller';
// Schemas
import { Order, OrderSchema } from './schemas/order.schema';
// Services
import { OrdersService } from './orders.service';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'ORDERS_PRODUCTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://wjdovbpn:boXVmPjKWIlMJ0xaTBqm_5jBgA36EuSg@lionfish.rmq.cloudamqp.com/wjdovbpn'],
          queue: 'orders_products_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    ]),
    ClientsModule.register([
      {
        name: 'ORDERS_EXPIRATION_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://wjdovbpn:boXVmPjKWIlMJ0xaTBqm_5jBgA36EuSg@lionfish.rmq.cloudamqp.com/wjdovbpn'],
          queue: 'orders_expiration_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    ]),
    ClientsModule.register([
      {
        name: 'ORDERS_PAYMENTS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://wjdovbpn:boXVmPjKWIlMJ0xaTBqm_5jBgA36EuSg@lionfish.rmq.cloudamqp.com/wjdovbpn'],
          queue: 'orders_payments_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    ]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule { }