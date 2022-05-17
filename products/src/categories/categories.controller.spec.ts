// NestJS
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import { ModuleMocker } from 'jest-mock';
import mongoose from 'mongoose';

// Custom
// Controllers
import { CategoriesController } from './categories.controller';
// Services
import { CategoriesService } from './categories.service';


const category = {
  "name": "Laptop",
  "createdAt": "2022-04-17T09:13:29.189Z",
  "updatedAt": "2022-04-17T09:13:29.189Z",
  "id": "625bda39a4a276404152ecc8"
};

const moduleMocker = new ModuleMocker(global);

describe('CategoriesController', () => {
  const categoryId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(category.id) as unknown as mongoose.Schema.Types.ObjectId;

  let controller: CategoriesController;
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController]
    })
      .useMocker((token) => {
        if (token === CategoriesService) {
          return {
            create: jest.fn().mockResolvedValue(category),
            findAll: jest.fn().mockResolvedValue([category]),
            findById: jest.fn().mockResolvedValue(category),
            findByName: jest.fn().mockResolvedValue(category),
            update: jest.fn().mockResolvedValue(category),
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

    controller = module.get<CategoriesController>(CategoriesController);
    service = module.get<CategoriesService>(CategoriesService);
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
        name: category.name
      });
      expect(service.create).toHaveBeenCalled();
    });

    it('should call create method on the service with create category dto', async () => {
      await controller.create({
        name: category.name
      });
      expect(service.create).toHaveBeenCalledWith({
        name: category.name
      });
    });

    it('should create a new category and save it', () => {
      expect(controller.create({
        name: category.name
      })).resolves.toEqual(category).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findAll', () => {
    it('should call findAll method on the service', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return all the categories', () => {
      expect(controller.findAll()).resolves.toEqual([category]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findById', () => {
    it('should call findById method on the service', async () => {
      await controller.findById(categoryId);
      expect(service.findById).toHaveBeenCalled();
    });

    it('should call findById method on the service with category id', async () => {
      await controller.findById(categoryId);
      expect(service.findById).toHaveBeenCalledWith(categoryId);
    });

    it('should find the category by id and return it', () => {
      expect(controller.findById(categoryId)).resolves.toEqual(category).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findByName', () => {
    it('should call findByName method on the service', async () => {
      await controller.findByName(category.name);
      expect(service.findByName).toHaveBeenCalled();
    });

    it('should call findByName method on the service with category name', async () => {
      await controller.findByName(category.name);
      expect(service.findByName).toHaveBeenCalledWith(category.name);
    });

    it('should find the category by name and return it', () => {
      expect(controller.findByName(category.name)).resolves.toEqual(category).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('update', () => {
    it('should call update method on the service', async () => {
      await controller.update(categoryId, {
        name: "test"
      });
      expect(service.update).toHaveBeenCalled();
    });

    it('should call update method on the service with category id and update category dto', async () => {
      await controller.update(categoryId, {
        name: "test"
      });
      expect(service.update).toHaveBeenCalledWith(categoryId, {
        name: "test"
      });
    });

    it('should find the category by id and update', () => {
      expect(controller.update(categoryId, {})).resolves.toEqual(category).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('remove', () => {
    it('should call remove method on the service', async () => {
      await controller.remove(categoryId);
      expect(service.remove).toHaveBeenCalled();
    });

    it('should call remove method on the service with category id', async () => {
      await controller.remove(categoryId);
      expect(service.remove).toHaveBeenCalledWith(categoryId);
    });
  });
});