// Nest
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument } from 'src/products/schemas/product.schema';

// Other Dependencies

// Custom
// DTOs
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review, ReviewDocument } from './schemas/review.schema';
// Entities
import { Model } from 'mongoose';


@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>
  ) { }

  async create(userId, createReviewDto: CreateReviewDto): Promise<Review> {
    const createdReview = new this.reviewModel({
      ...createReviewDto,
      user: userId
    });
    return createdReview.save();
  }

  async findAll(): Promise<Review[]> {
    return await this.reviewModel.find().populate('user').exec();
  }

  async findById(id): Promise<Review> {
    return await this.reviewModel.findById(id).populate('user').exec();
  }

  async update(id, updateReviewDto: UpdateReviewDto) {
    return await this.reviewModel.findByIdAndUpdate(id, updateReviewDto, { new: true });
  }

  async remove(id) {
    return await this.reviewModel.findByIdAndRemove(id);
  }
}
