// NestJS
import { PartialType } from '@nestjs/mapped-types';

// Custom
// DTOs
import { CreateCategoryDto } from './create-category.dto';


export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}