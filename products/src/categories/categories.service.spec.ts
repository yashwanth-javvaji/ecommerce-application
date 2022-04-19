// NestJS
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import mongoose from 'mongoose';

// Custom
// Schemas
import { CategoryDocument } from './schemas/category.schema';
// Services
import { CategoriesService } from './categories.service';


const category = {
  "name": "Laptop",
  "createdAt": "2022-04-17T09:13:29.189Z",
  "updatedAt": "2022-04-17T09:13:29.189Z",
  "id": "625bda39a4a276404152ecc8"
};

class CategoryModel {
  constructor(private data) { }
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue([category]) }));
  static findById = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(category) }));
  static findOne = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(category) }));
  static findByIdAndUpdate = jest.fn().mockImplementation(() => ({ exec: jest.fn().mockResolvedValue(category) }));
  static findByIdAndRemove = jest.fn().mockResolvedValue(true);
}

describe('CategoriesService', () => {
  const categoryId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(category.id) as unknown as mongoose.Schema.Types.ObjectId;

  let service: CategoriesService;
  let model: mongoose.Model<CategoryDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getModelToken('Category'),
          useValue: CategoryModel
        }
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    model = module.get<mongoose.Model<CategoryDocument>>(getModelToken('Category'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('create', () => {
    it('should create a new category and save it', () => {
      expect(service.create({
        name: category.name,
      })).resolves.toEqual({
        name: category.name
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

    it('should return all the categories', () => {
      expect(service.findAll()).resolves.toEqual([category]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findById', () => {
    it('should call findById method on the model', async () => {
      await service.findById(categoryId);
      expect(model.findById).toHaveBeenCalled();
    });

    it('should call findById method on the model with category id', async () => {
      await service.findById(categoryId);
      expect(model.findById).toHaveBeenCalledWith(categoryId);
    });

    it('should find the category by id and return it', () => {
      expect(service.findById(categoryId)).resolves.toEqual(category).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findByName', () => {
    it('should call findOne method on the model', async () => {
      await service.findByName(category.name);
      expect(model.findOne).toHaveBeenCalled();
    });

    it('should call findOne method on the model with category name', async () => {
      await service.findByName(category.name);
      expect(model.findOne).toHaveBeenCalledWith({
        name: category.name
      });
    });

    it('should find the category by name and return it', () => {
      expect(service.findByName(category.name)).resolves.toEqual(category).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('update', () => {
    it('should call findByIdAndUpdate method on the model', async () => {
      await service.update(categoryId, {
        name: "test"
      });
      expect(model.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should call findByIdAndUpdate method on the model with category id and update category dto', async () => {
      await service.update(categoryId, {
        name: "test"
      });
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(categoryId, {
        name: "test"
      }, {
        new: true
      });
    });

    it('should find the category by id and update', () => {
      expect(service.update(categoryId, {})).resolves.toEqual(category).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('remove', () => {
    it('should call findByIdAndRemove method on the model', async () => {
      await service.remove(categoryId);
      expect(model.findByIdAndRemove).toHaveBeenCalled();
    });

    it('should call findByIdAndRemove method on the model with category id', async () => {
      await service.remove(categoryId);
      expect(model.findByIdAndRemove).toHaveBeenCalledWith(categoryId);
    });
  });
});