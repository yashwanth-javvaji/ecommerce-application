// Other Dependencies
import { IsEmail, IsMongoId, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ObjectId } from 'mongoose';


export class CreateUserDto {
  @IsNotEmpty()
  @IsMongoId()
  _id: ObjectId;

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
}