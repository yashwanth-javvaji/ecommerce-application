// NestJS
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// Other Dependencies
import { Model, ObjectId } from 'mongoose';

// Custom
// DTOs
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
// Schemas
import { User, UserDocument } from './schemas/user.schema';


@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>
  ) { }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (!this.findByEmail(createUserDto["email"])) {
      delete Object.assign(createUserDto, { ["_id"]: createUserDto["id"] })["id"];
      const createdUser = new this.userModel(createUserDto);
      return createdUser.save();
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findById(id: ObjectId): Promise<User> {
    return await this.userModel.findById(id).exec();
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email }).exec();
  }

  async update(id: ObjectId, updateUserDto: Partial<UpdateUserDto>): Promise<User> {
    return await this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }

  async remove(id: ObjectId) {
    await this.userModel.findByIdAndRemove(id);
  }
}