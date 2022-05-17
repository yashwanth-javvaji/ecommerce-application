// NestJS
import { PartialType } from '@nestjs/mapped-types';

// Custom
// DTOs
import { CreateReviewDto } from './create-review.dto';


export class UpdateReviewDto extends PartialType(CreateReviewDto) {}