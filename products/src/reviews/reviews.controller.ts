// NestJS
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';

// Common
import { Public } from '@yj-major-project/common';

// Custom
// DTOs
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
// Schemas
import { Review } from './schemas/review.schema';
// Services
import { ReviewsService } from './reviews.service';


@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  async create(@Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return await this.reviewsService.create(createReviewDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Review[]> {
    return await this.reviewsService.findAll();
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id): Promise<Review> {
    return await this.reviewsService.findById(id);
  }

  // @Patch(':id')
  // async update(@Param('id') id, @Body() updateReviewDto: UpdateReviewDto): Promise<Review> {
  //   return await this.reviewsService.update(id, updateReviewDto);
  // }

  // @Delete(':id')
  // async remove(@Param('id') id) {
  //   return await this.reviewsService.remove(id);
  // }
}
