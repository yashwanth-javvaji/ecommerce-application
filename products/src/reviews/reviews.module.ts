// Nest
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from 'src/users/users.module';

// Custom
// Controllers
import { ReviewsController } from './reviews.controller';
// Entities
// Services
import { ReviewsService } from './reviews.service';
import { Review, ReviewSchema } from './schemas/review.schema';


@Module({
  imports: [
    MongooseModule.forFeature([{name: Review.name, schema: ReviewSchema}]),
    UsersModule
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService]
})
export class ReviewsModule {}
