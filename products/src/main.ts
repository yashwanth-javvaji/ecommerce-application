// NestJS
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// Other Dependencies
import { json, urlencoded } from 'express';

// Custom
// Modules
import { AppModule } from './app.module';


async function bootstrap() {
  // REST API
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '5mb' }));
  app.use(urlencoded({ limit: '5mb', extended: true }));
  app.setGlobalPrefix('api');
  await app.listen(3000);
  // Message Broker
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqps://wjdovbpn:boXVmPjKWIlMJ0xaTBqm_5jBgA36EuSg@lionfish.rmq.cloudamqp.com/wjdovbpn'],
      queue: 'auth_products_queue',
      queueOptions: {
        durable: false
      },
    }
  });
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqps://wjdovbpn:boXVmPjKWIlMJ0xaTBqm_5jBgA36EuSg@lionfish.rmq.cloudamqp.com/wjdovbpn'],
      queue: 'orders_products_queue',
      queueOptions: {
        durable: false
      },
    }
  });
  app.startAllMicroservices();
}
bootstrap();