// Nest
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

// Other Dependencies
import { ObjectID, Repository } from 'typeorm';

// Custom
// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Entities
import { User } from './entities/user.entity';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return await this.usersRepository.save(new User(createUserDto));
  }

  async findAll(): Promise<User[]> {
    return await this.usersRepository.find();
  }

  async findOneById(id: ObjectID): Promise<User | undefined> {
    return await this.usersRepository.findOne(id);
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return await this.usersRepository.findOne({
      where: {
        email
      }
    });
  }

  async update(id: ObjectID, updateUserDto: Partial<UpdateUserDto>) {
    const user = await this.usersRepository.findOne(id);
    if (!user) {
      throw new NotFoundException();
    }
    user.firstname = updateUserDto.firstname || user.firstname;
    user.lastname = updateUserDto.lastname || user.lastname;
    user.password = updateUserDto.password || user.password;
    if ('currentHashedRefreshToken' in updateUserDto) {
      user.currentHashedRefreshToken = updateUserDto.currentHashedRefreshToken;
    }
    return await this.usersRepository.save(user);
  }

  async remove(id: ObjectID) {
    const exists = await this.usersRepository.findOne(id);
    if (!exists) {
      throw new NotFoundException();
    }
    return this.usersRepository.delete({ id });
  }
}
