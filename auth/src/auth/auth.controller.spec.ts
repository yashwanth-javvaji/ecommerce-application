// NestJS
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import { ModuleMocker } from 'jest-mock';
import mongoose from 'mongoose';
const httpMocks = require('node-mocks-http');

// Custom
// Controllers
import { AuthController } from './auth.controller';
// Services
import { AuthService } from './auth.service';


const tokens = {
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNWRhMDIwYWEwNzg2NjM0NWRjNjNjMiIsImZpcnN0bmFtZSI6IkFkbWluIiwibGFzdG5hbWUiOiJTS1kgRS1Db21tZXJjZSIsImVtYWlsIjoiYWRtaW5AbWFqb3ItcHJvamVjdC5jb20iLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE2NTAzMDY2MjMsImV4cCI6MTY1MDMxMDIyM30.YcLiaFu-PTOBpcZ0TN-8ald_h90WUZYjRJ7IsprsC9w",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNWRhMDIwYWEwNzg2NjM0NWRjNjNjMiIsImZpcnN0bmFtZSI6IkFkbWluIiwibGFzdG5hbWUiOiJTS1kgRS1Db21tZXJjZSIsImVtYWlsIjoiYWRtaW5AbWFqb3ItcHJvamVjdC5jb20iLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE2NTAzMDY2MjMsImV4cCI6MTY1MDkxMTQyM30.CMA0fE21b5vr5YplSQqYqw1O1Xe_XlVANBzXU1Ep2f0"
};

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

describe('AuthController', () => {
  const userId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(user.id) as unknown as mongoose.Schema.Types.ObjectId;

  const mockRequest = httpMocks.createRequest();
  mockRequest.user = user;
  mockRequest.logout = () => jest.fn().mockResolvedValue(true);

  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController]
    })
      .useMocker((token) => {
        if (token === AuthService) {
          return {
            signup: jest.fn().mockResolvedValue(tokens),
            signin: jest.fn().mockResolvedValue(tokens),
            getCurrentUser: jest.fn().mockResolvedValue(user),
            signout: jest.fn().mockResolvedValue(true),
            refreshAccessToken: jest.fn().mockResolvedValue({ accessToken: tokens.accessToken }),
            verifyToken: jest.fn().mockResolvedValue(true)
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token);
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('signup', () => {
    it('should call signup method on the service', async () => {
      await controller.signup({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password",
        confirmPassword: "password"
      });
      expect(service.signup).toHaveBeenCalled();
    });

    it('should call signup method on the service with signup auth dto', async () => {
      await controller.signup({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password",
        confirmPassword: "password"
      });
      expect(service.signup).toHaveBeenCalledWith({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password",
        confirmPassword: "password"
      });
    });

    it('should return tokens', () => {
      expect(controller.signup({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password",
        confirmPassword: "password"
      })).resolves.toEqual(tokens).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('signin', () => {
    it('should call signin method on the service', async () => {
      await controller.signin(mockRequest);
      expect(service.signin).toHaveBeenCalled();
    });

    it('should call signin method on the service with user details', async () => {
      await controller.signin(mockRequest);
      expect(service.signin).toHaveBeenCalledWith(mockRequest.user);
    });

    it('should return tokens', () => {
      expect(controller.signin(mockRequest)).resolves.toEqual(tokens).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('currentUser', () => {
    it('should call getCurrentUser method on the service', async () => {
      await controller.currentUser(mockRequest);
      expect(service.getCurrentUser).toHaveBeenCalled();
    });

    it('should call getCurrentUser method on the service with current user id', async () => {
      await controller.currentUser(mockRequest);
      expect(service.getCurrentUser).toHaveBeenCalledWith(userId.toString());
    });

    it('should return current user', () => {
      expect(controller.currentUser(mockRequest)).resolves.toEqual(user).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('signout', () => {
    it('should call signout method on the service', async () => {
      await controller.signout(userId, mockRequest);
      expect(service.signout).toHaveBeenCalled();
    });

    it('should call signout method on the service with current user id', async () => {
      await controller.signout(userId, mockRequest);
      expect(service.signout).toHaveBeenCalledWith(userId);
    });
  });

  describe('refreshAccessToken', () => {
    it('should call refreshAccessToken method on the service', async () => {
      await controller.refreshAccessToken(userId, tokens.refreshToken);
      expect(service.refreshAccessToken).toHaveBeenCalled();
    });

    it('should call refreshAccessToken method on the service with user id and refresh token', async () => {
      await controller.refreshAccessToken(userId, tokens.refreshToken);
      expect(service.refreshAccessToken).toHaveBeenCalledWith(userId, tokens.refreshToken);
    });

    it('should return access token', () => {
      expect(controller.refreshAccessToken(userId, tokens.refreshToken)).resolves.toEqual({ accessToken: tokens.accessToken }).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('verifyToken', () => {
    it('should call verifyToken method on the service', async () => {
      await controller.verifyToken(tokens.accessToken);
      expect(service.verifyToken).toHaveBeenCalled();
    });

    it('should call verifyToken method on the service with token', async () => {
      await controller.verifyToken(tokens.accessToken);
      expect(service.verifyToken).toHaveBeenCalledWith(tokens.accessToken);
    });

    it('should return true', () => {
      expect(controller.verifyToken(tokens.accessToken)).resolves.toEqual(true);
    });
  });
});