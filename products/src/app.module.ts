// NestJS
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';

// Common
import { JwtAccessTokenAuthGuard, JwtAccessTokenStrategy, JwtRefreshTokenStrategy, RolesGuard } from '@yj-major-project/common';

// Custom
// Modules
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    CategoriesModule,
    ProductsModule,
    ReviewsModule,
    UsersModule
  ],
  providers: [
    JwtAccessTokenStrategy,
    JwtRefreshTokenStrategy,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
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
export class AppModule {}