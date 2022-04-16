// Other Dependencies
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";


export class SignupAuthDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly firstname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  readonly lastname: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly confirmPassword: string;
}