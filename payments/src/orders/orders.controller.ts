// NestJS
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

// Common
import { OrderStatus } from '@yj-major-project/common';

// Other Dependencies
import { ObjectId } from 'mongoose';

// Custom
// DTOs
import { CreateOrderDto } from './dto/create-order.dto';
// Services
import { OrdersService } from './orders.service';


@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @EventPattern('orderCreated')
  async create(@Payload() createOrderDto: CreateOrderDto) {
    await this.ordersService.create(createOrderDto);
  }

  @EventPattern('orderCanceled')
  async cancel(@Payload() id: ObjectId) {
    await this.ordersService.update(id, { orderStatus: OrderStatus.Canceled });
  }
}