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


@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @EventPattern('createUser')
  async create(@Payload() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @EventPattern('updateUser')
  async update(@Payload() updateUserDto: UpdateUserDto) {
    await this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @EventPattern('removeUser')
  async remove(@Payload() id: ObjectId) {
    await this.usersService.remove(id);
  }
}
