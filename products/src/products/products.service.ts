// Nest
import { Injectable, NotFoundException } from '@nestjs/common';

// Other Dependencies
import { ObjectId } from 'mongoose';
// Custom
// DTOs
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// Entities
// Services
import { CategoriesService } from 'src/categories/categories.service';
import { InjectModel } from '@nestjs/mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { Model } from 'mongoose';


@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>
  ) { }

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

  async findById(id: ObjectId): Promise<Product> {
    return await this.productModel.findById(id).populate('category').populate({
      path: 'reviews',
      populate: {
        path: 'user'
      }
    }).exec();
  }

  async findByCategory(category: string): Promise<Product[]> {
    return await this.productModel.find({
      where: {
        'category.name': category
      }
    }).exec();
  }

  async update(id: ObjectId, updateProductDto: UpdateProductDto): Promise<Product> {
    return await this.productModel.findByIdAndUpdate(id, updateProductDto, { new: true });
  }

  async addReview(id: ObjectId, reviewId: ObjectId): Promise<Product> {
    return await this.productModel.findByIdAndUpdate(id, { $push: { reviews: reviewId } }, { new: true });
  }

  async remove(id) {
    return await this.productModel.findByIdAndRemove(id);
  }
}
