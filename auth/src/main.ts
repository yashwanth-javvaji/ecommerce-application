// NestJS
import { NestFactory } from '@nestjs/core';

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
}
bootstrap();