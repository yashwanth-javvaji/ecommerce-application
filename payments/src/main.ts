// NestJS
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

// Custom
// Modules
import { AppModule } from './app.module';


async function bootstrap() {
  // REST API
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  await app.listen(3000);
  
  // Message Broker
  await app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqps://wjdovbpn:boXVmPjKWIlMJ0xaTBqm_5jBgA36EuSg@lionfish.rmq.cloudamqp.com/wjdovbpn'],
      queue: 'orders_payments_queue',
      queueOptions: {
        durable: false
      },
    }
  });
  app.startAllMicroservices();
}
bootstrap();
