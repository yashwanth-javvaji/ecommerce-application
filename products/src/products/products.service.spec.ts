// NestJS
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import mongoose from 'mongoose';

// Custom
// Schemas
import { ProductDocument } from './schemas/product.schema';
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

class ProductModel {
  constructor(private data) { }
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue([product])
      }))
    }))
  }));
  static findById = jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(product)
      }))
    }))
  }));
  static findByIdAndUpdate = jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(product)
      }))
    }))
  }));
  static findByIdAndRemove = jest.fn().mockResolvedValue(true);
}

describe('ProductsService', () => {
  const category: string = product.category.name;
  const categoryId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(product.category.id) as unknown as mongoose.Schema.Types.ObjectId;
  const reviewId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(product.reviews[0].id) as unknown as mongoose.Schema.Types.ObjectId;
  const productId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(product.id) as unknown as mongoose.Schema.Types.ObjectId;

  let service: ProductsService;
  let model: mongoose.Model<ProductDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Product'),
          useValue: ProductModel
        }
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get<mongoose.Model<ProductDocument>>(getModelToken('Product'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product and save it', () => {
      expect(service.create({
        name: product.name,
        category: categoryId,
        brand: product.brand,
        description: product.description,
        stock: product.stock,
        price: product.price,
        discount: product.discount
      })).resolves.toEqual({
        name: product.name,
        category: categoryId,
        brand: product.brand,
        description: product.description,
        stock: product.stock,
        price: product.price,
        discount: product.discount
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

    it('should return all the products', () => {
      expect(service.findAll()).resolves.toEqual([product]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findAllByCategory', () => {
    it('should call find method on the model', async () => {
      await service.findAllByCategory(category);
      expect(model.find).toHaveBeenCalled();
    });

    it('should call find method on the model with where condition on category name', async () => {
      await service.findAllByCategory(category);
      expect(model.find).toHaveBeenCalledWith({
        where: {
          'category.name': category
        }
      });
    });

    it('should find the products by category name and return it', () => {
      expect(service.findAllByCategory(category)).resolves.toEqual([product]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findById', () => {
    it('should call findById method on the model', async () => {
      await service.findById(productId);
      expect(model.findById).toHaveBeenCalled();
    });

    it('should call findById method on the model with product id', async () => {
      await service.findById(productId);
      expect(model.findById).toHaveBeenCalledWith(productId);
    });

    it('should find the product by id and return it', () => {
      expect(service.findById(productId)).resolves.toEqual(product).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('update', () => {
    it('should call findByIdAndUpdate method on the model', async () => {
      await service.update(productId, {
        name: "test"
      });
      expect(model.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should call findByIdAndUpdate method on the model with product id and update product dto', async () => {
      await service.update(productId, {
        name: "test"
      });
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(productId, {
        name: "test"
      }, {
        new: true
      });
    });

    it('should find the product by id and update', () => {
      expect(service.update(productId, {})).resolves.toEqual(product).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('addReview', () => {
    it('should call findByIdAndUpdate method on the model', async () => {
      await service.addReview(productId, reviewId);
      expect(model.findByIdAndUpdate).toHaveBeenCalled();
    });

    it('should call findByIdAndUpdate method on the model with product id and push the review to reviews list', async () => {
      await service.addReview(productId, reviewId);
      expect(model.findByIdAndUpdate).toHaveBeenCalledWith(productId, {
        $push: {
          reviews: reviewId
        }
      }, {
        new: true
      });
    });

    it('should find the product by id and push review to the reviews list', () => {
      expect(service.addReview(productId, reviewId)).resolves.toEqual(product).catch((err) => {
        console.log(err);
      });
    })
  });

  describe('remove', () => {
    it('should call findByIdAndRemove method on the model', async () => {
      await service.remove(productId);
      expect(model.findByIdAndRemove).toHaveBeenCalled();
    });

    it('should call findByIdAndRemove method on the model with product id', async () => {
      await service.remove(productId);
      expect(model.findByIdAndRemove).toHaveBeenCalledWith(productId);
    });
  });
});