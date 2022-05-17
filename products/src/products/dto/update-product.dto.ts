// NestJS
import { PartialType } from '@nestjs/mapped-types';

// Other Dependencies
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Custom
// DTOs
import { CreateProductDto } from './create-product.dto';


export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  productImage: string;
}