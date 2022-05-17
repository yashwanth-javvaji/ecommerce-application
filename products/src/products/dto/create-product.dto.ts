// Other Dependencies
import { IsMongoId, IsNotEmpty, IsNumber, IsString, Max, Min, MinLength } from "class-validator";
import { ObjectId } from 'mongoose';


export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsMongoId()
  category: ObjectId;

  @IsNotEmpty()
  @IsString()
  @MinLength(20)
  description: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
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