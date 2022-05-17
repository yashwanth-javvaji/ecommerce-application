// NestJS
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
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
    @Inject('ORDERS_PRODUCTS_SERVICE') private readonly productsClient: ClientProxy,
    @Inject('ORDERS_EXPIRATION_SERVICE') private readonly expirationClient: ClientProxy,
    @Inject('ORDERS_PAYMENTS_SERVICE') private readonly paymentsClient: ClientProxy
  ) { }

  async create(userId: ObjectId, createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = new this.orderModel({
      ...createOrderDto,
      expiresAt: new Date(new Date().getTime() + (5 * 60 * 1000)), // expiration window time: 5 mins
      userId
    });
    this.productsClient.emit('orderCreated', createdOrder);
    this.expirationClient.emit('orderExpire', createdOrder);
    this.paymentsClient.emit('orderCreated', createdOrder);
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

  async update(id: ObjectId, updateOrderDto: Partial<UpdateOrderDto>): Promise<Order> {
    const order = await this.orderModel.findById(id);
    
    if (!order) {
      throw new NotFoundException();
    }

    if ((order.orderStatus === OrderStatus.Completed) && updateOrderDto.hasOwnProperty("orderStatus")) {
      throw new BadRequestException();
    }
    
    if (updateOrderDto.orderStatus === OrderStatus.Canceled) {
      const updatedOrder = await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
      if (updatedOrder.orderStatus === OrderStatus.Canceled) {
        this.productsClient.emit('orderCanceled', updatedOrder);
        this.paymentsClient.emit('orderCanceled', id);
      }
      return updatedOrder;
    }

    return await this.orderModel.findByIdAndUpdate(id, updateOrderDto, { new: true }).exec();
  }

  async remove(id: ObjectId) {
    await this.orderModel.findByIdAndRemove(id);
  }
}