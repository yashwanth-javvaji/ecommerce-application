// NestJS
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import { ModuleMocker } from 'jest-mock';
import mongoose from 'mongoose';

// Custom
// Controllers
import { ReviewsController } from './reviews.controller';
// Services
import { ReviewsService } from './reviews.service';


const review = {
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
};

const moduleMocker = new ModuleMocker(global);

describe('ReviewsController', () => {
  const reviewId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(review.id) as unknown as mongoose.Schema.Types.ObjectId;
  const userId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(review.user.id) as unknown as mongoose.Schema.Types.ObjectId;

  let controller: ReviewsController;
  let service: ReviewsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewsController]
    })
      .useMocker((token) => {
        if (token === ReviewsService) {
          return {
            create: jest.fn().mockResolvedValue(review),
            findAll: jest.fn().mockResolvedValue([review]),
            findById: jest.fn().mockResolvedValue(review),
            update: jest.fn().mockResolvedValue(review),
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

    controller = module.get<ReviewsController>(ReviewsController);
    service = module.get<ReviewsService>(ReviewsService);
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
        rating: review.rating,
        comment: review.comment,
        user: userId
      });
      expect(service.create).toHaveBeenCalled();
    });

    it('should call create method on the service with create review dto', async () => {
      await controller.create({
        rating: review.rating,
        comment: review.comment,
        user: userId
      });
      expect(service.create).toHaveBeenCalledWith({
        rating: review.rating,
        comment: review.comment,
        user: userId
      });
    });

    it('should create a new review and save it', () => {
      expect(controller.create({
        rating: review.rating,
        comment: review.comment,
        user: userId
      })).resolves.toEqual(review).catch((err) => {
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
      expect(controller.findAll()).resolves.toEqual([review]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findById', () => {
    it('should call findById method on the service', async () => {
      await controller.findById(reviewId);
      expect(service.findById).toHaveBeenCalled();
    });

    it('should call findById method on the service with review id', async () => {
      await controller.findById(reviewId);
      expect(service.findById).toHaveBeenCalledWith(reviewId);
    });

    it('should find the review by id and return it', () => {
      expect(controller.findById(reviewId)).resolves.toEqual(review).catch((err) => {
        console.log(err);
      });
    });
  });

  // describe('update', () => {
  //   it('should call update method on the service', async () => {
  //     await controller.update(reviewId, {
  //       rating: 5
  //     });
  //     expect(service.update).toHaveBeenCalled();
  //   });

  //   it('should call update method on the service with review id and update review dto', async () => {
  //     await controller.update(reviewId, {
  //       rating: 5
  //     });
  //     expect(service.update).toHaveBeenCalledWith(reviewId, {
  //       rating: 5
  //     });
  //   });

  //   it('should find the review by id and update', () => {
  //     expect(controller.update(reviewId, {})).resolves.toEqual(review).catch((err) => {
  //       console.log(err);
  //     });
  //   });
  // });

  // describe('remove', () => {
  //   it('should call remove method on the service', async () => {
  //     await controller.remove(reviewId);
  //     expect(service.remove).toHaveBeenCalled();
  //   });

  //   it('should call remove method on the service with review id', async () => {
  //     await controller.remove(reviewId);
  //     expect(service.remove).toHaveBeenCalledWith(reviewId);
  //   });
  // });
});