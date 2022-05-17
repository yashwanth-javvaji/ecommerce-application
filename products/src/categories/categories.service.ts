// NestJS
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// Other Dependencies
import { Model, ObjectId } from 'mongoose';

// Custom
// DTOs
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
// Schemas
import { Category, CategoryDocument } from './schemas/category.schema';


@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private readonly categoryModel: Model<CategoryDocument>) { }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = new this.categoryModel(createCategoryDto);
    return createdCategory.save();
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find().exec();
  }

  async findById(id: ObjectId): Promise<Category> {
    return await this.categoryModel.findById(id).exec();
  }

  async findByName(name: string): Promise<Category> {
    return await this.categoryModel.findOne({ name }).exec();
  }

  async update(id: ObjectId, updateCategoryDto: Partial<UpdateCategoryDto>): Promise<Category> {
    return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, { new: true }).exec();
  }

  async remove(id: ObjectId) {
    await this.categoryModel.findByIdAndRemove(id);
  }
}