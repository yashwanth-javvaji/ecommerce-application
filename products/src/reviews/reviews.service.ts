// NestJS
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// Other Dependencies
import { Model } from 'mongoose';

// Custom
// DTOs
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
// Schemas
import { Review, ReviewDocument } from './schemas/review.schema';


@Injectable()
export class ReviewsService {
  constructor(@InjectModel(Review.name) private readonly reviewModel: Model<ReviewDocument>) { }

  async create(createReviewDto: CreateReviewDto): Promise<Review> {
    const createdReview = new this.reviewModel(createReviewDto);
    return createdReview.save();
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewModel.find().populate('user').exec();
  }

  async findById(id): Promise<Review> {
    return await this.reviewModel.findById(id).populate('user').exec();
  }

  // async update(id, updateReviewDto: UpdateReviewDto): Promise<Review> {
  //   return await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true }).populate('user').exec();
  // }

  // async remove(id) {
  //   await this.reviewModel.findByIdAndRemove(id);
  // }
}
