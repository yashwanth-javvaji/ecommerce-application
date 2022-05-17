// NestJS
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// Custom
// Modules
import { AppModule } from './app.module';


async function bootstrap() {
  // Message Broker
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqps://wjdovbpn:boXVmPjKWIlMJ0xaTBqm_5jBgA36EuSg@lionfish.rmq.cloudamqp.com/wjdovbpn'],
      queue: 'orders_expiration_queue',
      queueOptions: {
        durable: false
      },
    }
  });
  app.listen();
}
bootstrap();