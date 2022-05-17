// NestJS
import { Test, TestingModule } from '@nestjs/testing';

// Common
import { OrderStatus } from '@yj-major-project/common';

// Other Dependencies
import { ModuleMocker } from 'jest-mock';
import mongoose from 'mongoose';

// Custom
// Controllers
import { OrdersController } from './orders.controller';
// Services
import { OrdersService } from './orders.service';


const order = {
  "orderStatus": "open",
  "paymentStatus": "unpaid",
  "deliveryStatus": "queue",
  "items": [
    {
      "name": "Mac",
      "category": {
        "name": "Laptop",
        "createdAt": "2022-04-16T19:00:07.080Z",
        "updatedAt": "2022-04-16T19:00:07.080Z",
        "id": "625b1237018c5daa37c7fb10"
      },
      "productImage": "1747b1b0-7e78-4f32-99d8-7e033fd3c40d.avif",
      "brand": "Apple",
      "description": "Mac product description",
      "price": 100000,
      "discount": 10,
      "id": "625b12aa018c5daa37c7fb16",
      "quantity": 1,
      "itemTotal": 100000
    }
  ],
  "total": 90000,
  "shippingAddress": {
    "address1": "Plot no. 51, R K Housing Colony",
    "address2": "",
    "city": "Hyderabad",
    "state": "Telangana",
    "zip": "500062",
    "country": "India"
  },
  "expiresAt": new Date(new Date().getTime() + (5 * 60 * 1000)),
  "userId": "625b086e0df0e5916a15b0ad",
  "createdAt": "2022-04-16T19:02:35.503Z",
  "updatedAt": "2022-04-16T19:02:35.503Z",
  "id": "625b12cb391f05b6847691c2"
};

const moduleMocker = new ModuleMocker(global);

describe('OrdersController', () => {
  const orderId: mongoose.ObjectId = new mongoose.Types.ObjectId(order.id) as unknown as mongoose.ObjectId;

  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
    })
      .useMocker((token) => {
        if (token === OrdersService) {
          return {
            create: jest.fn().mockResolvedValue(order),
            findById: jest.fn().mockResolvedValue(order),
            update: jest.fn().mockResolvedValue(order)
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token);
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call create method on the service', async () => {
      await controller.create({
        _id: orderId as mongoose.ObjectId,
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total,
        expiresAt: order.expiresAt
      });
      expect(service.create).toHaveBeenCalled();
    });

    it('should call create method on the service with create order dto', async () => {
      await controller.create({
        _id: orderId as mongoose.ObjectId,
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total,
        expiresAt: order.expiresAt
      });
      expect(service.create).toHaveBeenCalledWith({
        _id: orderId as mongoose.ObjectId,
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total,
        expiresAt: order.expiresAt
      });
    });
  });

  describe('cancel', () => {
    it('should call update method on the service', async () => {
      await controller.cancel(orderId);
      expect(service.update).toHaveBeenCalled();
    });

    it('should call update method on the service with order id and update order dto', async () => {
      await controller.cancel(orderId);
      expect(service.update).toHaveBeenCalledWith(orderId, {
        orderStatus: OrderStatus.Canceled
      });
    });
  });
});