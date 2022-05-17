// NestJS
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

// Common
import { Role } from '@yj-major-project/common';

// Other Dependencies
import { Model, ObjectId } from 'mongoose';

// Custom
// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Schemas
import { User, UserDocument } from './schemas/user.schema';


@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @Inject('AUTH_PRODUCTS_SERVICE') private readonly client: ClientProxy
  ) { }

  async onModuleInit() {
    const createdAdmin = new this.userModel({
      "firstname": "Admin",
      "lastname": "SKY E-Commerce",
      "email": process.env.ADMIN_EMAIL,
      "password": process.env.ADMIN_PASSWORD,
      "roles": [Role.Admin]
    });
    this.client.emit('userCreated', createdAdmin);
    createdAdmin.save();
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    this.client.emit('userCreated', createdUser);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findById(id: ObjectId): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async update(id: ObjectId, updateUserDto: Partial<UpdateUserDto>): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
    if (!!updatedUser) {
      this.client.emit('userUpdated', updatedUser);
    }
    return updatedUser;
  }

  async remove(id: ObjectId) {
    await this.userModel.findByIdAndRemove(id);
    this.client.emit('userRemoved', id);
  }
}