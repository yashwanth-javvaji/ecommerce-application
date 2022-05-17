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
  "firstname": "firstname",
  "lastname": "lastname",
  "email": "user@mail.com",
  "roles": [
    "user"
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
            create: jest.fn().mockResolvedValue(user),
            findAll: jest.fn().mockResolvedValue([user]),
            findById: jest.fn().mockResolvedValue(user),
            update: jest.fn().mockResolvedValue(user),
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
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password"
      });
      expect(service.create).toHaveBeenCalled();
    });

    it('should call create method on the service with create user dto', async () => {
      await controller.create({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password"
      });
      expect(service.create).toHaveBeenCalledWith({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password"
      });
    });

    it('should create a new user and save it', () => {
      expect(controller.create({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password"
      })).resolves.toEqual(user).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findAll', () => {
    it('should call findAll method on the service', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return all the users', () => {
      expect(controller.findAll()).resolves.toEqual([user]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findById', () => {
    it('should call findById method on the service', async () => {
      await controller.findById(userId);
      expect(service.findById).toHaveBeenCalled();
    });

    it('should call findById method on the service with user id', async () => {
      await controller.findById(userId);
      expect(service.findById).toHaveBeenCalledWith(userId);
    });

    it('should find the user by id and return it', () => {
      expect(controller.findById(userId)).resolves.toEqual(user).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('update', () => {
    it('should call update method on the service', async () => {
      await controller.update(userId, {
        firstname: "firstname"
      });
      expect(service.update).toHaveBeenCalled();
    });

    it('should call update method on the service with user id and update user dto', async () => {
      await controller.update(userId, {
        firstname: "firstname"
      });
      expect(service.update).toHaveBeenCalledWith(userId, {
        firstname: "firstname"
      });
    });

    it('should find the user by id and update', () => {
      expect(controller.update(userId, {})).resolves.toEqual(user).catch((err) => {
        console.log(err);
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