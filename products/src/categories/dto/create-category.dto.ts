// Other Dependencies
import { IsNotEmpty, IsString } from "class-validator";


export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
