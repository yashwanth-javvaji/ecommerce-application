// Other Dependencies
import { IsNotEmpty, IsString, MinLength } from "class-validator";


export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name: string;
}