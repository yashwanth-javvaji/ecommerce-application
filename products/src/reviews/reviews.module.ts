// NestJS
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Custom
// Controllers
import { ReviewsController } from './reviews.controller';
// Modules
import { UsersModule } from '../users/users.module';
// Schemas
import { Review, ReviewSchema } from './schemas/review.schema';
// Services
import { ReviewsService } from './reviews.service';


@Module({
  imports: [
    MongooseModule.forFeature([{name: Review.name, schema: ReviewSchema}]),
    UsersModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}