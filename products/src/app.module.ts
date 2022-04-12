import { Module, ValidationPipe } from '@nestjs/common';
import { CategoriesModule } from './categories/categories.module';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ProductsModule } from './products/products.module';
// YJ
import { JwtAccessTokenAuthGuard, RolesGuard } from '@yj-major-project/common';
import { JwtAccessTokenStrategy, JwtRefreshTokenStrategy } from '@yj-major-project/common';
import { ReviewsModule } from './reviews/reviews.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    CategoriesModule,
    ProductsModule,
    UsersModule,
    ReviewsModule,
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
