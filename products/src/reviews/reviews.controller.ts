// Nest
import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Request } from '@nestjs/common';
import { Public } from '@yj-major-project/common';

// Other Dependencies

// Custom
// DTOs
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
// Entities
// Services
import { ReviewsService } from './reviews.service';
import { Review } from './schemas/review.schema';


@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) { }

  @Post()
  async create(@Request() req, @Body() createReviewDto: CreateReviewDto): Promise<Review> {
    return await this.reviewsService.create(req.user.id, createReviewDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Review[]> {
    return await this.reviewsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id): Promise<Review> {
    return await this.reviewsService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id, @Body() updateReviewDto: UpdateReviewDto) {
    return await this.reviewsService.update(id, updateReviewDto);
  }

  @Delete(':id')
  async remove(@Param('id') id) {
    return await this.reviewsService.remove(id);
  }
}
