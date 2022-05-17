// NestJS
import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards, NotFoundException } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

// Common
import { hasRoles, OrderStatus, PaymentStatus, Role, RolesGuard } from '@yj-major-project/common';

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

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
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
  async update(@Param('id') id: ObjectId, @Body() updateOrderDto: Partial<UpdateOrderDto>): Promise<Order> {
    return await this.ordersService.update(id, updateOrderDto);
  }

  @EventPattern('expiredOrder')
  async expiredOrder(@Payload() orderId: ObjectId) {
    const order = await this.ordersService.findById(orderId);
    if (!order) {
      throw new NotFoundException();
    }
    if (order.orderStatus !== OrderStatus.Completed) {
      await this.ordersService.update(orderId, {
        orderStatus: OrderStatus.Canceled
      });
    }
  }

  @EventPattern('paymentSucceeded')
  async paymentSucceeded(@Payload() orderId: ObjectId) {
    const order = await this.ordersService.update(orderId, {
      orderStatus: OrderStatus.Confirmed,
      paymentStatus: PaymentStatus.Paid 
    });
  }

  @EventPattern('paymentFailed')
  async paymentFailed(@Payload() orderId: ObjectId) {
    const order = await this.ordersService.update(orderId, {
      orderStatus: OrderStatus.Canceled,
      paymentStatus: PaymentStatus.Failed 
    });
  }

  @hasRoles(Role.Admin)
  @UseGuards(RolesGuard)
  @Delete(':id')
  async remove(@Param('id') id: ObjectId) {
    return await this.ordersService.remove(id);
  }
}