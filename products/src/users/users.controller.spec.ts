// NestJS
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import { ModuleMocker } from 'jest-mock';
import mongoose from 'mongoose';

// Custom
// Controllers
import { UsersController } from './users.controller';
// Services
import { UsersService } from './users.service';


const user = {
  "firstname": "Admin",
  "lastname": "SKY E-Commerce",
  "email": "admin@major-project.com",
  "roles": [
    "admin"
  ],
  "profileImage": null,
  "createdAt": "2022-04-17T09:12:47.942Z",
  "updatedAt": "2022-04-17T11:03:25.706Z",
  "id": "625bda0f7381e98ec5862816"
};

const moduleMocker = new ModuleMocker(global);

describe('UsersController', () => {
  const userId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(user.id) as unknown as mongoose.Schema.Types.ObjectId;

  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController]
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn()
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token);
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
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
        _id: userId,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      });
      expect(service.create).toHaveBeenCalled();
    });

    it('should call create method on the service with create user dto', async () => {
      await controller.create({
        _id: userId,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      });
      expect(service.create).toHaveBeenCalledWith({
        _id: userId,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      });
    });
  });

  describe('update', () => {
    it('should call update method on the service', async () => {
      await controller.update({
        id: userId,
        firstname: "test"
      });
      expect(service.update).toHaveBeenCalled();
    });

    it('should call update method on the service with user id and update user dto', async () => {
      await controller.update({
        id: userId,
        firstname: "test"
      });
      expect(service.update).toHaveBeenCalledWith(userId, {
        id: userId,
        firstname: "test"
      });
    });
  });

  describe('remove', () => {
    it('should call remove method on the service', async () => {
      await controller.remove(userId);
      expect(service.remove).toHaveBeenCalled();
    });

    it('should call remove method on the service with user id', async () => {
      await controller.remove(userId);
      expect(service.remove).toHaveBeenCalledWith(userId);
    });
  });
});