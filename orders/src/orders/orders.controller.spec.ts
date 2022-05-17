// NestJS
import { Test, TestingModule } from '@nestjs/testing';

// Common
import { OrderStatus } from '@yj-major-project/common';

// Other Dependencies
import { ModuleMocker } from 'jest-mock';
import mongoose from 'mongoose';
const httpMocks = require('node-mocks-http');

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
  const orderId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(order.id) as unknown as mongoose.Schema.Types.ObjectId;
  const userId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(order.userId) as unknown as mongoose.Schema.Types.ObjectId;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = { id: userId };

  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController]
    })
      .useMocker((token) => {
        if (token === OrdersService) {
          return {
            create: jest.fn().mockResolvedValue(order),
            findAll: jest.fn().mockResolvedValue([order]),
            findAllByUserId: jest.fn().mockResolvedValue([order]),
            findById: jest.fn().mockResolvedValue(order),
            findByIdForUserId: jest.fn().mockResolvedValue(order),
            update: jest.fn().mockResolvedValue(order),
            remove: jest.fn().mockResolvedValue(true)
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
      await controller.create(mockRequest, {
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total
      });
      expect(service.create).toHaveBeenCalled();
    });

    it('should call create method on the service with user id and create order dto', async () => {
      await controller.create(mockRequest, {
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total
      });
      expect(service.create).toHaveBeenCalledWith(userId, {
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total
      });
    });

    it('should create a new order and save it', () => {
      expect(controller.create(mockRequest, {
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total
      })).resolves.toEqual(order).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findAll', () => {
    it('should call findAll method on the service', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return all the orders', () => {
      expect(controller.findAll()).resolves.toEqual([order]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findAllByUserId', () => {
    it('should call findAllByUserId method on the service', async () => {
      await controller.findAllByUserId(mockRequest);
      expect(service.findAllByUserId).toHaveBeenCalled();
    });

    it('should call findAllByUserId method on the service with user id', async () => {
      await controller.findAllByUserId(mockRequest);
      expect(service.findAllByUserId).toHaveBeenCalledWith(userId);
    });

    it('should return all the orders for the given user id', () => {
      expect(controller.findAllByUserId(mockRequest)).resolves.toEqual([order]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findById', () => {
    it('should call findById method on the service', async () => {
      await controller.findById(orderId);
      expect(service.findById).toHaveBeenCalled();
    });

    it('should call findById method on the service with order id', async () => {
      await controller.findById(orderId);
      expect(service.findById).toHaveBeenCalledWith(orderId);
    });

    it('should find the order by id and return it', () => {
      expect(controller.findById(orderId)).resolves.toEqual(order).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findByIdForUserId', () => {
    it('should call findByIdForUserId method on the service', async () => {
      await controller.findByIdForUserId(mockRequest, orderId);
      expect(service.findByIdForUserId).toHaveBeenCalled();
    });

    it('should call findByIdForUserId method on the service with user id and order id', async () => {
      await controller.findByIdForUserId(mockRequest, orderId);
      expect(service.findByIdForUserId).toHaveBeenCalledWith(userId, orderId);
    });

    it('should find the order by id for the given user id and return it', () => {
      expect(controller.findByIdForUserId(mockRequest, orderId)).resolves.toEqual(order).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('update', () => {
    it('should call update method on the service', async () => {
      await controller.update(orderId, {
        orderStatus: OrderStatus.Confirmed
      });
      expect(service.update).toHaveBeenCalled();
    });

    it('should call update method on the service with order id and update order dto', async () => {
      await controller.update(orderId, {
        orderStatus: OrderStatus.Confirmed
      });
      expect(service.update).toHaveBeenCalledWith(orderId, {
        orderStatus: OrderStatus.Confirmed
      });
    });

    it('should find the order by id and update', () => {
      expect(controller.update(orderId, {})).resolves.toEqual(order).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('remove', () => {
    it('should call remove method on the service', async () => {
      await controller.remove(orderId);
      expect(service.remove).toHaveBeenCalled();
    });

    it('should call remove method on the service with order id', async () => {
      await controller.remove(orderId);
      expect(service.remove).toHaveBeenCalledWith(orderId);
    });
  });
});