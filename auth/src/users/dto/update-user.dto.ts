// NestJS
import { PartialType } from '@nestjs/mapped-types';

// Common
import { Role } from '@yj-major-project/common';

// Other Dependencies
import { ArrayNotEmpty, ArrayUnique, IsArray, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

// Custom
// DTOs
import { CreateUserDto } from './create-user.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  profileImage: string;

  @IsOptional()
  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsEnum(Role, { each: true })
  roles: Role[];

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  currentHashedRefreshToken: string;
}