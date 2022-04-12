// Other Dependencies
import { IsEmail, IsMongoId, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { ObjectId } from 'mongoose';

export class CreateUserDto {
  @IsNotEmpty()
  @IsMongoId()
  _id: ObjectId;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  readonly firstname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  readonly lastname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  @IsEmail()
  readonly email: string;
}
