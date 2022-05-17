// NestJS
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import { ModuleMocker } from 'jest-mock';
import mongoose from 'mongoose';

// Custom
// Controllers
import { ProductsController } from './products.controller';
// Services
import { ProductsService } from './products.service';


const product = {
  "name": "Mac",
  "category": {
    "name": "Laptop",
    "createdAt": "2022-04-17T09:13:29.189Z",
    "updatedAt": "2022-04-17T09:13:29.189Z",
    "id": "625bda39a4a276404152ecc8"
  },
  "productImage": "30f73461-74ce-46bb-9286-2056b813061e.avif",
  "brand": "Apple",
  "description": "Mac product description",
  "stock": 10,
  "price": 100000,
  "discount": 10,
  "reviews": [
    {
      "rating": 5,
      "comment": "Testing review feature",
      "user": {
        "firstname": "Admin",
        "lastname": "SKY E-Commerce",
        "email": "admin@major-project.com",
        "profileImage": null,
        "updatedAt": "2022-04-17T09:13:34.632Z",
        "createdAt": "2022-04-17T09:12:47.942Z",
        "id": "625bda0f7381e98ec5862816"
      },
      "createdAt": "2022-04-17T10:03:25.968Z",
      "updatedAt": "2022-04-17T10:03:25.968Z",
      "id": "625be5eda4a276404152ecdd"
    }
  ],
  "createdAt": "2022-04-17T09:23:26.445Z",
  "updatedAt": "2022-04-17T10:03:25.978Z",
  "id": "625bdc8ea4a276404152ecd0"
};

const moduleMocker = new ModuleMocker(global);

describe('ProductsController', () => {
  const category: string = product.category.name;
  const categoryId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(product.category.id) as unknown as mongoose.Schema.Types.ObjectId;
  const reviewId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(product.reviews[0].id) as unknown as mongoose.Schema.Types.ObjectId;
  const productId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(product.id) as unknown as mongoose.Schema.Types.ObjectId;

  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
    })
      .useMocker((token) => {
        if (token === ProductsService) {
          return {
            create: jest.fn().mockResolvedValue(product),
            findAll: jest.fn().mockResolvedValue([product]),
            findAllByCategory: jest.fn().mockResolvedValue([product]),
            findById: jest.fn().mockResolvedValue(product),
            update: jest.fn().mockResolvedValue(product),
            addReview: jest.fn().mockResolvedValue(product),
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

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
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
        name: product.name,
        category: categoryId,
        description: product.name,
        brand: product.name,
        stock: product.stock,
        price: product.price,
        discount: product.discount
      });
      expect(service.create).toHaveBeenCalled();
    });

    it('should call create method on the service with create product dto', async () => {
      await controller.create({
        name: product.name,
        category: categoryId,
        description: product.name,
        brand: product.name,
        stock: product.stock,
        price: product.price,
        discount: product.discount
      });
      expect(service.create).toHaveBeenCalledWith({
        name: product.name,
        category: categoryId,
        description: product.name,
        brand: product.name,
        stock: product.stock,
        price: product.price,
        discount: product.discount
      });
    });

    it('should create a new product and save it', () => {
      expect(service.create({
        name: product.name,
        category: categoryId,
        brand: product.brand,
        description: product.description,
        stock: product.stock,
        price: product.price,
        discount: product.discount
      })).resolves.toEqual(product).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findAll', () => {
    it('should call findAll method on the service', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });

    it('should return all the products', () => {
      expect(controller.findAll()).resolves.toEqual([product]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findAllByCategory', () => {
    it('should call findAllByCategory method on the service', async () => {
      await controller.findAllByCategory(category);
      expect(service.findAllByCategory).toHaveBeenCalled();
    });

    it('should call findAllByCategory method on the service with category name', async () => {
      await controller.findAllByCategory(category);
      expect(service.findAllByCategory).toHaveBeenCalledWith(category);
    });

    it('should find the products by category and return it', () => {
      expect(controller.findAllByCategory(category)).resolves.toEqual([product]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findById', () => {
    it('should call findById method on the service', async () => {
      await controller.findById(productId);
      expect(service.findById).toHaveBeenCalled();
    });

    it('should call findById method on the service with product id', async () => {
      await controller.findById(productId);
      expect(service.findById).toHaveBeenCalledWith(productId);
    });

    it('should find the product by id and return it', () => {
      expect(controller.findById(productId)).resolves.toEqual(product).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('update', () => {
    it('should call update method on the service', async () => {
      await controller.update(productId, {
        name: "test"
      });
      expect(service.update).toHaveBeenCalled();
    });

    it('should call update method on the service with product id and update product dto', async () => {
      await controller.update(productId, {
        name: "test"
      });
      expect(service.update).toHaveBeenCalledWith(productId, {
        name: "test"
      });
    });

    it('should find the product by id and update', () => {
      expect(controller.update(productId, {})).resolves.toEqual(product).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('addReview', () => {
    it('should call addReview method on the service', async () => {
      await controller.addReview(productId, reviewId);
      expect(service.addReview).toHaveBeenCalled();
    });

    it('should call addReview method on the service with product id and review id', async () => {
      await controller.addReview(productId, reviewId);
      expect(service.addReview).toHaveBeenCalledWith(productId, reviewId);
    });

    it('should find the product by id and push review to the reviews list', () => {
      expect(controller.addReview(productId, reviewId)).resolves.toEqual(product).catch((err) => {
        console.log(err);
      });
    })
  });

  describe('remove', () => {
    it('should call remove method on the service', async () => {
      await controller.remove(productId);
      expect(service.remove).toHaveBeenCalled();
    });

    it('should call remove method on the service with product id', async () => {
      await controller.remove(productId);
      expect(service.remove).toHaveBeenCalledWith(productId);
    });
  });
});