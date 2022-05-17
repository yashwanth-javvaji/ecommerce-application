// NestJS
import { ClientProxy } from '@nestjs/microservices';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import { ModuleMocker } from 'jest-mock';
import mongoose from 'mongoose';
import { OrdersService } from '../orders/orders.service';

import { PaymentsService } from './payments.service';
import { PaymentDocument } from './schemas/payment.schema';


const order = {
  "orderStatus": "canceled",
  "paymentStatus": "paid",
  "deliveryStatus": "queue",
  "items": [
    {
      "name": "Apple iPhone 13",
      "category": {
        "name": "Cell Phones & Accessories",
        "createdAt": "2022-05-17T19:42:04.365Z",
        "updatedAt": "2022-05-17T19:42:04.365Z",
        "id": "6283fa8c3438684524706a23"
      },
      "productImage": "f8227b2d-eb09-42ef-b3b0-168439827d96.webp",
      "brand": "Apple",
      "description": "15.4 cm (6.1 inch), Super Retina XDR, 128GB ROM | iOS 15, Hexa-Core A15 Bionic Chip Processor, R: 12MP + 12MP | F: 12MP, Proximity Sensor | Facial Unlock",
      "price": 79900,
      "discount": 10,
      "id": "6283fa8c3438684524706a25",
      "quantity": 1,
      "itemTotal": 79900
    }
  ],
  "total": 71910,
  "shippingAddress": {
    "address1": "Address Line 1",
    "address2": "",
    "city": "City",
    "state": "State",
    "zip": "000000",
    "country": "Country"
  },
  "expiresAt": "2022-05-17T19:47:47.766Z",
  "userId": "6283fa7334bd823c9d91898f",
  "createdAt": "2022-05-17T19:42:47.805Z",
  "updatedAt": "2022-05-17T19:47:48.517Z",
  "id": "6283fab7dde95120032348ff"
};

const payment = {
  "userId": "6283fa7334bd823c9d91898f",
  "orderId": "6283fab7dde95120032348ff",
  "checkoutSession": "cs_test_a1IiJcoRiKCDY6wrXv0zYSzjlAQEzPpTbfLTMLsyVDFZuAtjjn1iSkKQYv",
  "paymentIntent": "pi_3L0WIBSGQJCC9tNf1cviRTfe",
  "status": "paid",
  "createdAt": "2022-05-17T19:42:51.661Z",
  "updatedAt": "2022-05-17T19:43:21.378Z",
  "id": "6283fabb02d2e354a85acb73"
};

class PaymentModel {
  constructor(private data) { }
  save = jest.fn().mockResolvedValue(this.data);
  static findById = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(payment) }));
  static findOne = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(payment) }));
  static find = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue([payment]) }));
  static findOneAndUpdate = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(payment) }));
}

class Client {
  static emit = jest.fn().mockResolvedValue(true);
}

const moduleMocker = new ModuleMocker(global);

describe('PaymentsService', () => {
  const orderId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(payment.orderId) as unknown as mongoose.Schema.Types.ObjectId;
  const userId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(payment.userId) as unknown as mongoose.Schema.Types.ObjectId;

  let paymentsService: PaymentsService;
  let ordersService: OrdersService;
  let model: mongoose.Model<PaymentDocument>;
  let client: ClientProxy;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: getModelToken('Payment'),
          useValue: PaymentModel
        },
        {
          provide: 'PAYMENTS_ORDERS_SERVICE',
          useValue: Client
        },
      ],
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

    paymentsService = module.get<PaymentsService>(PaymentsService);
    ordersService = module.get<OrdersService>(OrdersService);
    model = module.get<mongoose.Model<PaymentDocument>>(getModelToken('Payment'));
    client = module.get<ClientProxy>('PAYMENTS_ORDERS_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(paymentsService).toBeDefined();
    expect(ordersService).toBeDefined();
    expect(model).toBeDefined();
    expect(client).toBeDefined();
  });

  describe('findAll', () => {
    it('should call find method on the model', async () => {
      await paymentsService.findAll();
      expect(model.find).toHaveBeenCalled();
    });

    it('should return all the payments', () => {
      expect(paymentsService.findAll()).resolves.toEqual([payment]).catch((err) => {
        console.log(err);
      });
    });
  });
});