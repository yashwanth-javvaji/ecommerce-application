// NestJS
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

// Common
import { JwtAccessTokenAuthGuard, JwtAccessTokenStrategy, JwtRefreshTokenStrategy, RolesGuard } from '@yj-major-project/common';

// Custom
// Modules
import { OrdersModule } from './orders/orders.module';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    OrdersModule
  ],
  providers: [
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        stopAtFirstError: true
      })
    },
    {
      provide: APP_GUARD,
      useClass: JwtAccessTokenAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule { }