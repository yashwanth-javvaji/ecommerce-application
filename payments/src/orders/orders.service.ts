// NestJS
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

// Other Dependencies
import { Model, ObjectId } from 'mongoose';

// Custom
// DTOs
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
// Schemas
import { Order, OrderDocument } from './schemas/order.schema';


@Injectable()
export class OrdersService {
  constructor(@InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>) { }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    delete Object.assign(createOrderDto, { ["_id"]: createOrderDto["id"] })["id"];
    const createdOrder = new this.orderModel(createOrderDto);
    return createdOrder.save();
  }

  async findById(id: ObjectId): Promise<Order> {
    return await this.orderModel.findById(id).exec();
  }

  async update(id: ObjectId, updateOrderDto: Partial<UpdateOrderDto>): Promise<Order> {
    return await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
  }
}