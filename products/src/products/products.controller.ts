// NestJS
import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// Common
import { hasRoles, Public, Role, RolesGuard } from "@yj-major-project/common";

// Other Dependencies
import * as path from 'path';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { ObjectId } from 'mongoose';

// Custom
// DTOs
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
// Schemas
import { Product } from './schemas/product.schema';
// Services
import { ProductsService } from './products.service';


export const storage = {
  storage: diskStorage({
    destination: './uploads/product-images',
    filename: (req, file, cb) => {
      const filename: string = uuidv4();
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    }
  })
};

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto): Promise<Product> {
    return await this.productsService.create(createProductDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Product[]> {
    return await this.productsService.findAll();
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: ObjectId): Promise<Product> {
    return await this.productsService.findById(id);
  }

  @Public()
  @Get('/category/:category')
  async fingByCategory(@Param('category') category: string): Promise<Product[]> {
    return await this.productsService.findByCategory(category);
  }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  update(@Param('id') id: ObjectId, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Patch(':id/reviews')
  async addReview(@Param('id') id: ObjectId, @Body('reviewId') reviewId) {
    return this.productsService.addReview(id, reviewId);
  }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: ObjectId) {
    return this.productsService.remove(id);
  }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Post(':id/upload-product-image')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadProductImage(@Param('id') id, @UploadedFile() file) {
    await this.productsService.update(id, { productImage: file.filename });
  }

  @Public()
  @Get('product-images/:filename')
  findProductImage(@Param('filename') filename, @Res() res) {
    return res.sendFile(path.join(process.cwd(), 'uploads/product-images/' + filename));
  }
}
