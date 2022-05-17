// NestJS
import { PartialType } from '@nestjs/mapped-types';

// Other Dependencies
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ObjectId } from 'mongoose';

// Custom
// DTOs
import { CreateUserDto } from './create-user.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNotEmpty()
  @IsMongoId()
  id: ObjectId;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  profileImage: string;
}