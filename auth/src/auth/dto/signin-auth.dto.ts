// Other Dependencies
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class SigninAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}