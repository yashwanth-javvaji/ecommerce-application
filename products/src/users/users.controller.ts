import { Controller, Get, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ObjectId } from 'mongoose';
import { User } from './schemas/user.schema';

@Controller('products-users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @MessagePattern('createUser')
  async create(@Payload() createUserDto: CreateUserDto) {
    await this.usersService.create(createUserDto);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @MessagePattern('updateUser')
  async update(@Payload() updateUserDto: UpdateUserDto) {
    await this.usersService.update(updateUserDto.id, updateUserDto);
  }

  @MessagePattern('removeUser')
  async remove(@Payload() id: ObjectId) {
    await this.usersService.remove(id);
  }
}
