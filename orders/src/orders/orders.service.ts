// NestJS
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';

// Common
import { OrderStatus } from '@yj-major-project/common';

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
    @InjectModel(Order.name) private readonly orderModel: Model<OrderDocument>,
    @Inject('ORDERS_SERVICE') private readonly client: ClientProxy
  ) { }

  async create(userId: ObjectId, createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      userId
    });
    this.client.emit('orderCreated', createdOrder);
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
    const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
    if (updatedOrder.orderStatus === OrderStatus.Cancelled) {
      this.client.emit('orderCancelled', updatedOrder);
    }
    return updatedOrder;
  }

  async remove(id: ObjectId) {
    await this.orderModel.findByIdAndRemove(id);
  }
}