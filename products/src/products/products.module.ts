// NestJS
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Custom
// Controller
import { ProductsController } from './products.controller';
// Modules
import { CategoriesModule } from '../categories/categories.module';
// Schemas
import { Product, ProductSchema } from './schemas/product.schema';
// Services
import { ProductsService } from './products.service';


@Module({
  imports: [
    MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}]),
    CategoriesModule
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}