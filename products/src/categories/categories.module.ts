// NestJS
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Custom
// Controllers
import { CategoriesController } from './categories.controller';
// Schemas
import { Category, CategorySchema } from './schemas/category.schema';
// Services
import { CategoriesService } from './categories.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: Category.name, schema: CategorySchema }])],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService]
})
export class CategoriesModule { }