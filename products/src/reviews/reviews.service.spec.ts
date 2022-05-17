// NestJS
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import mongoose from 'mongoose';

// Custom
// Schemas
import { ReviewDocument } from './schemas/review.schema';
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

class ReviewModel {
  constructor(private data) { }
  save = jest.fn().mockResolvedValue(this.data);
  static find = jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue([review])
    }))
  }));
  static findById = jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(review)
    }))
  }));
  static findByIdAndUpdate = jest.fn().mockImplementation(() => ({
    populate: jest.fn().mockImplementation(() => ({
      exec: jest.fn().mockResolvedValue(review)
    }))
  }));
  static findByIdAndRemove = jest.fn().mockResolvedValue(true);
}

describe('ReviewsService', () => {
  const reviewId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(review.id) as unknown as mongoose.Schema.Types.ObjectId;
  const userId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(review.user.id) as unknown as mongoose.Schema.Types.ObjectId;

  let service: ReviewsService;
  let model: mongoose.Model<ReviewDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        {
          provide: getModelToken('Review'),
          useValue: ReviewModel
        }
      ],
    }).compile();

    service = module.get<ReviewsService>(ReviewsService);
    model = module.get<mongoose.Model<ReviewDocument>>(getModelToken('Review'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(model).toBeDefined();
  });

  describe('create', () => {
    it('should create a new review and save it', () => {
      expect(service.create({
        rating: review.rating,
        comment: review.comment,
        user: userId
      })).resolves.toEqual({
        rating: review.rating,
        comment: review.comment,
        user: userId
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

    it('should return all the reviews', () => {
      expect(service.findAll()).resolves.toEqual([review]).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('findById', () => {
    it('should call findById method on the model', async () => {
      await service.findById(reviewId);
      expect(model.findById).toHaveBeenCalled();
    });

    it('should call findById method on the model with review id', async () => {
      await service.findById(reviewId);
      expect(model.findById).toHaveBeenCalledWith(reviewId);
    });

    it('should find the review by id and return it', () => {
      expect(service.findById(reviewId)).resolves.toEqual(review).catch((err) => {
        console.log(err);
      });
    });
  });

  // describe('update', () => {
  //   it('should call findByIdAndUpdate method on the model', async () => {
  //     await service.update(reviewId, {
  //       rating: 5
  //     });
  //     expect(model.findByIdAndUpdate).toHaveBeenCalled();
  //   });

  //   it('should call findByIdAndUpdate method on the model with review id and update review dto', async () => {
  //     await service.update(reviewId, {
  //       rating: 5
  //     });
  //     expect(model.findByIdAndUpdate).toHaveBeenCalledWith(reviewId, {
  //       rating: 5
  //     }, {
  //       new: true
  //     });
  //   });

  //   it('should find the review by id and update', () => {
  //     expect(service.update(reviewId, {})).resolves.toEqual(review).catch((err) => {
  //       console.log(err);
  //     });
  //   });
  // });

  // describe('remove', () => {
  //   it('should call findByIdAndRemove method on the model', async () => {
  //     await service.remove(reviewId);
  //     expect(model.findByIdAndRemove).toHaveBeenCalled();
  //   });

  //   it('should call findByIdAndRemove method on the model with review id', async () => {
  //     await service.remove(reviewId);
  //     expect(model.findByIdAndRemove).toHaveBeenCalledWith(reviewId);
  //   });
  // });
});