// Other Dependencies
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  firstname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}