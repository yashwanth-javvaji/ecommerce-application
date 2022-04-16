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
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>
  ) { }

  async create(userId: ObjectId, createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      userId
    });
    return createdOrder.save();
  }

  async findAll(): Promise<Order[]> {
    return await this.orderModel.find().exec();
  }

  async findAllByUserId(id: ObjectId): Promise<Order[]> {
    return await this.orderModel.find({
      userId: id
    }).exec();
  }

  async findById(id: ObjectId): Promise<Order> {
    return await this.orderModel.findById(id).exec();
  }

  async findByIdForUserId(userId: ObjectId, id: ObjectId): Promise<Order> {
    return await this.orderModel.findOne({
      _id: id,
      userId
    }).exec();
  }

  async update(id: ObjectId, updateOrderDto: UpdateOrderDto): Promise<Order> {
    return await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true });
  }

  async remove(id: ObjectId) {
    return await this.orderModel.findByIdAndRemove(id);
  }
}
