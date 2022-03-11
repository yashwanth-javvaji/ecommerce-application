// Nest
import { PartialType } from '@nestjs/mapped-types';

// Other Dependencies
import { IsString } from 'class-validator';

// Custom
// DTOs
import { CreateUserDto } from './create-user.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  currentHashedRefreshToken?: string;
}
