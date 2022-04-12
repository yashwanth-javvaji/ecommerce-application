// Other Dependencies
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";


export class SigninAuthDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(1024)
  readonly password: string;
}