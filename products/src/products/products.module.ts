// Nest
import { Module } from '@nestjs/common';

// Custom
// Controller
import { ProductsController } from './products.controller';
// Entities
// Modules
import { CategoriesModule } from 'src/categories/categories.module';
// Services
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Product, ProductSchema } from './schemas/product.schema';


@Module({
  imports: [
    CategoriesModule,
    MongooseModule.forFeature([{name: Product.name, schema: ProductSchema}])
  ],
  controllers: [ProductsController],
  providers: [ProductsService]
})
export class ProductsModule {}
