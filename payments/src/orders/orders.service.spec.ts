// NestJS
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
  static findById = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(order) }));
  static findByIdAndUpdate = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(order) }));
}

describe('OrdersService', () => {
  const orderId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(order.id) as unknown as mongoose.Schema.Types.ObjectId;

  let service: OrdersService;
  let model: mongoose.Model<OrderDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getModelToken('Order'),
          useValue: OrderModel
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    model = module.get<mongoose.Model<OrderDocument>>(getModelToken('Order'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order and save it', () => {
      expect(service.create({
        _id: orderId as mongoose.ObjectId,
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total,
        expiresAt: order.expiresAt
      })).resolves.toEqual({
        items: order.items.map((item) => ({ ...item, id: new mongoose.Types.ObjectId(item.id) as unknown as mongoose.Schema.Types.ObjectId })),
        shippingAddress: order.shippingAddress,
        total: order.total,
        expiresAt: order.expiresAt
      }).catch((err) => {
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

    it('should find the order by id and update', () => {
      model.findByIdAndUpdate = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(order) }));
      expect(service.update(orderId, {})).resolves.toEqual(order).catch((err) => {
        console.log(err);
      });
    });
  });
});