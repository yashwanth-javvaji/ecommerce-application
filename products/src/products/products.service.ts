// NestJS
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// Other Dependencies
import { Model, ObjectId } from 'mongoose';

// Custom
// DTOs
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// Schemas
import { Product, ProductDocument } from './schemas/product.schema';


@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private readonly productModel: Model<ProductDocument>) { }

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const createdProduct = new this.productModel(createProductDto);
    return createdProduct.save();
  }

  async findAll(): Promise<Product[]> {
    return await this.productModel.find().populate('category').populate({
      path: 'reviews',
      populate: {
        path: 'user'
      }
    }).exec();
  }

  async findAllByCategory(category: string): Promise<Product[]> {
    return await this.productModel.find({
      where: {
        'category.name': category
      }
    }).populate('category').populate({
      path: 'reviews',
      populate: {
        path: 'user'
      }
    }).exec();
  }

  async findById(id: ObjectId): Promise<Product> {
    return await this.productModel.findById(id).populate('category').populate({
      path: 'reviews',
      populate: {
        path: 'user'
      }
    }).exec();
  }

  async update(id: ObjectId, updateProductDto: Partial<UpdateProductDto>): Promise<Product> {
    return await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true }).populate('category').populate({
      path: 'reviews',
      populate: {
        path: 'user'
      }
    }).exec();
  }

  async updateStock(id: ObjectId, quantity: Number): Promise<Product> {
    return await this.productModel.findByIdAndUpdate(id, {
      "$inc": { "stock": quantity }
    }, {
      new: true
    }).populate('category').populate({
      path: 'reviews',
      populate: {
        path: 'user'
      }
    }).exec();
  }

  async addReview(id: ObjectId, reviewId: ObjectId): Promise<Product> {
    return await this.productModel.findByIdAndUpdate(id, { $push: { reviews: reviewId } }, { new: true }).populate('category').populate({
      path: 'reviews',
      populate: {
        path: 'user'
      }
    }).exec();
  }

  async remove(id) {
    await this.productModel.findByIdAndRemove(id);
  }
}
