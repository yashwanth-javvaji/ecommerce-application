// NestJS
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

// Other Dependencies
import { ObjectId } from 'mongoose';

// Custom
// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Services
import { UsersService } from './users.service';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @EventPattern('userCreated')
  async create(@Payload() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @EventPattern('userUpdated')
  async update(@Payload() updateUserDto: Partial<UpdateUserDto>) {
    await this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @EventPattern('userRemoved')
  async remove(@Payload() id: ObjectId) {
    await this.usersService.remove(id);
  }
}
