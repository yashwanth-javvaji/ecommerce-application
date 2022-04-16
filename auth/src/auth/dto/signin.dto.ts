// Other Dependencies
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class SigninAuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly password: string;
}