// NestJS
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';

// Common
import { hasRoles, Role, RolesGuard } from '@yj-major-project/common';

// Other Dependencies
import { ObjectId } from 'mongoose';

// Custom
// DTOs
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
// Schemas
import { Order } from './schemas/order.schema';
// Services
import { OrdersService } from './orders.service';


@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  async create(@Request() req, @Body() createOrderDto: CreateOrderDto): Promise<Order> {
    return await this.ordersService.create(req.user.id, createOrderDto);
  }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get()
  async findAll(): Promise<Order[]> {
    return await this.ordersService.findAll();
  }

  @Get('/my')
  async findAllByUserId(@Request() req): Promise<Order[]> {
    return await this.ordersService.findAllByUserId(req.user.id);
  }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Get(':id')
  async findById(@Param('id') id: ObjectId): Promise<Order> {
    return await this.ordersService.findById(id);
  }

  @Get('my/:id')
  async findByIdForUserId(@Request() req, @Param('id') id: ObjectId): Promise<Order> {
    return await this.ordersService.findByIdForUserId(req.user.id, id);
  }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Patch(':id')
  async update(@Param('id') id: ObjectId, @Body() updateOrderDto: UpdateOrderDto): Promise<Order> {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: ObjectId) {
    return await this.ordersService.remove(id);
  }
}
