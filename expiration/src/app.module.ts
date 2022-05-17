// NestJS
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';

// Custom
// Modules
import { ExpirationModule } from './expiration/expiration.module';


@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST
      },
    }),
    ExpirationModule
  ]
})
export class AppModule {}
