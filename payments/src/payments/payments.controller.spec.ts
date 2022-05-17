import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

// Other Dependencies
import { ModuleMocker } from 'jest-mock';
import mongoose from 'mongoose';
const httpMocks = require('node-mocks-http');


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

const moduleMocker = new ModuleMocker(global);

describe('PaymentsController', () => {
  const orderId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(payment.orderId) as unknown as mongoose.Schema.Types.ObjectId;
  const userId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(payment.userId) as unknown as mongoose.Schema.Types.ObjectId;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = { id: userId };

  let controller: PaymentsController;
  let service: PaymentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
    })
      .useMocker((token) => {
        if (token === PaymentsService) {
          return {
            create: jest.fn(),
            status: jest.fn(),
            findAll: jest.fn().mockResolvedValue([payment])
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token);
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get<PaymentsService>(PaymentsService);
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
      await controller.create(mockRequest, { orderId });
      expect(service.create).toHaveBeenCalled();
    });

    it('should call create method on the service with user id and order id', async () => {
      await controller.create(mockRequest, { orderId });
      expect(service.create).toHaveBeenCalledWith(userId, { orderId });
    });
  });

  describe('status', () => {
    it('should call status method on the service', async () => {
      await controller.status(mockRequest, orderId);
      expect(service.status).toHaveBeenCalled();
    });

    it('should call status method on the service with user id and order id', async () => {
      await controller.status(mockRequest, orderId);
      expect(service.status).toHaveBeenCalledWith(userId, orderId);
    });
  });

  describe('findAll', () => {
    it('should call findAll method on the service', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return all the payments', () => {
      expect(controller.findAll()).resolves.toEqual([payment]).catch((err) => {
        console.log(err);
      });
    });
  });
});