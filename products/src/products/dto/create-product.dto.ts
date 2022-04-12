// Other Dependencies
import { IsMongoId, IsNotEmpty, IsNumber, IsString, Max, MaxLength, Min, MinLength } from "class-validator";
import { ObjectId } from 'mongoose';

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  category: ObjectId;

  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  @MaxLength(1023)
  description: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  brand: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  price: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Max(100)
  discount: number;
}
