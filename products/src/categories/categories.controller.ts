// NestJS
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';

// Common
import { hasRoles, Public, Role, RolesGuard } from "@yj-major-project/common";

// Other Dependencies
import { ObjectId } from 'mongoose';

// Custom
// DTOs
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
// Schemas
import { Category } from './schemas/category.schema';
// Services
import { CategoriesService } from './categories.service';


@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoriesService.create(createCategoryDto);
  }

  @Public()
  @Get()
  async findAll(): Promise<Category[]> {
    return await this.categoriesService.findAll();
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: ObjectId): Promise<Category> {
    return await this.categoriesService.findById(id);
  }

  @Public()
  @Get('name/:name')
  async findByName(@Param('name') name: string): Promise<Category> {
    return await this.categoriesService.findByName(name);
  }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: ObjectId, @Body() updateCategoryDto: Partial<UpdateCategoryDto>): Promise<Category> {
    return await this.categoriesService.update(id, updateCategoryDto);
  }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: ObjectId) {
    return await this.categoriesService.remove(id);
  }
}