// NestJS
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

// Custom
// Controllers
import { ExpirationController } from './expiration.controller';
// Processors
import { ExpirationProcessor } from './expiration.processor';


@Module({
  imports: [
    BullModule.registerQueue({
      name: 'expiration',
    }),
    ClientsModule.register([
      {
        name: 'EXPIRATION_ORDERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://wjdovbpn:boXVmPjKWIlMJ0xaTBqm_5jBgA36EuSg@lionfish.rmq.cloudamqp.com/wjdovbpn'],
          queue: 'expiration_orders_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    ]),
  ],
  controllers: [ExpirationController],
  providers: [ExpirationProcessor],
})
export class ExpirationModule { }