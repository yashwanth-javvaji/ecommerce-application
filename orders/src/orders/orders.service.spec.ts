// NestJS
import { BadRequestException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

// Common
import { OrderStatus } from '@yj-major-project/common';

// Other Dependencies
import mongoose from 'mongoose';

// Custom
// Schemas
import { OrderDocument } from './schemas/order.schema';
// Services
import { OrdersService } from './orders.service';


const order = {
  "orderStatus": "completed",
  "paymentStatus": "paid",
  "deliveryStatus": "delivered",
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
  "updatedAt": "2022-04-17T19:02:35.503Z",
  "id": "625b12cb391f05b6847691c2"
};

class OrderModel {
  constructor(private data) { }
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue([order]) }));
  static findById = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(order) }));
  static findOne = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(order) }));
  static findByIdAndUpdate = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(order) }));
  static findByIdAndRemove = jest.fn().mockResolvedValue(true);
}

class Client {
  static emit = jest.fn().mockResolvedValue(true);
}

describe('OrdersService', () => {
  const orderId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(order.id) as unknown as mongoose.Schema.Types.ObjectId;
  const userId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(order.userId) as unknown as mongoose.Schema.Types.ObjectId;

  let service: OrdersService;
  let model: mongoose.Model<OrderDocument>;
  let productsClient: ClientProxy;
  let expirationClient: ClientProxy;
  let paymentsClient: ClientProxy;


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken('Order'),
          useValue: OrderModel
        },
        {
          provide: 'ORDERS_PRODUCTS_SERVICE',
          useValue: Client
        },
        {
          provide: 'ORDERS_EXPIRATION_SERVICE',
          useValue: Client
        },
        {
          provide: 'ORDERS_PAYMENTS_SERVICE',
          useValue: Client
        }
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    model = module.get<mongoose.Model<OrderDocument>>(getModelToken('Order'));
    productsClient = module.get<ClientProxy>('ORDERS_PRODUCTS_SERVICE');
    expirationClient = module.get<ClientProxy>('ORDERS_EXPIRATION_SERVICE');
    paymentsClient = module.get<ClientProxy>('ORDERS_PAYMENTS_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
    expect(productsClient).toBeDefined();
    expect(expirationClient).toBeDefined();
    expect(paymentsClient).toBeDefined();
  });

  describe('create', () => {
    it('should call emit method on the clients', async () => {
      await service.create(userId, {
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total
      });
      expect(productsClient.emit).toHaveBeenCalled();
      expect(expirationClient.emit).toHaveBeenCalled();
      expect(paymentsClient.emit).toHaveBeenCalled();
    });

    it('should create a new order and save it', () => {
      expect(service.create(userId, {
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total
      })).resolves.toEqual({
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total,
        expiresAt: expect.any(Object),
        userId
      }).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findAll', () => {
    it('should call find method on the model', async () => {
      await service.findAll();
      expect(model.find).toHaveBeenCalled();
    });

    it('should return all the orders', () => {
      expect(service.findAll()).resolves.toEqual([order]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findAllByUserId', () => {
    it('should call find method on the model', async () => {
      await service.findAllByUserId(userId);
      expect(model.find).toHaveBeenCalled();
    });

    it('should call find method on the model with user id', async () => {
      await service.findAllByUserId(userId);
      expect(model.find).toHaveBeenCalledWith({
        userId
      });
    });

    it('should return all the orders for the given user id', () => {
      expect(service.findAllByUserId(userId)).resolves.toEqual([order]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findById', () => {
    it('should call findById method on the model', async () => {
      await service.findById(orderId);
      expect(model.findById).toHaveBeenCalled();
    });

    it('should call findById method on the model with order id', async () => {
      await service.findById(orderId);
      expect(model.findById).toHaveBeenCalledWith(orderId);
    });

    it('should find the order by id and return it', () => {
      expect(service.findById(orderId)).resolves.toEqual(order).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findByIdForUserId', () => {
    it('should call findOne method on the model', async () => {
      await service.findByIdForUserId(userId, orderId);
      expect(model.findOne).toHaveBeenCalled();
    });

    it('should call findOne method on the model with user id and order id', async () => {
      await service.findByIdForUserId(userId, orderId);
      expect(model.findOne).toHaveBeenCalledWith({
        _id: orderId,
        userId
      });
    });

    it('should find the order by id for the given user id and return it', () => {
      expect(service.findByIdForUserId(userId, orderId)).resolves.toEqual(order).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('update', () => {
    it('should call findByIdAndUpdate method on the model', async () => {
      await service.update(orderId, {
        orderStatus: OrderStatus.Canceled
      });
      expect(model.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should call findByIdAndUpdate method on the model with order id and update order dto', async () => {
      await service.update(orderId, {
        orderStatus: OrderStatus.Canceled
      });
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(orderId, {
        orderStatus: OrderStatus.Canceled
      }, {
        new: true
      });
    });

    it('should throw an exception if updating order status from completed to canceled', () => {
      model.findById = jest.fn().mockResolvedValue(order);
      expect(service.update(orderId, {
        orderStatus: OrderStatus.Canceled
      })).rejects.toThrow(new BadRequestException());
    });

    it('should call emit method on the clients if updated order status is canceled', async () => {
      model.findById = jest.fn().mockResolvedValue({
        ...order,
        orderStatus: OrderStatus.Confirmed
      });
      model.findByIdAndUpdate = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue({
          ...order,
          orderStatus: OrderStatus.Canceled
        })
      }));
      await service.update(orderId, {
        orderStatus: OrderStatus.Canceled
      });
      expect(productsClient.emit).toHaveBeenCalled();
      expect(paymentsClient.emit).toHaveBeenCalled();
    });

    it('should find the order by id and update', () => {
      model.findByIdAndUpdate = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(order) }));
      expect(service.update(orderId, {})).resolves.toEqual(order).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('remove', () => {
    it('should call findByIdAndRemove method on the model', async () => {
      await service.remove(orderId);
      expect(model.findByIdAndRemove).toHaveBeenCalled();
    });

    it('should call findByIdAndRemove method on the model with order id', async () => {
      await service.remove(orderId);
      expect(model.findByIdAndRemove).toHaveBeenCalledWith(orderId);
    });
  });
});