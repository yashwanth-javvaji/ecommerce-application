// NestJS
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import { ModuleMocker } from 'jest-mock';
import mongoose from 'mongoose';

// Custom
// Services
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';


const tokens = {
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNWU2Mjg1ZmFlMmIyNWY2ZGEzZDBmMCIsImZpcnN0bmFtZSI6IkFkbWluIiwibGFzdG5hbWUiOiJTS1kgRS1Db21tZXJjZSIsImVtYWlsIjoiYWRtaW5AbWFqb3ItcHJvamVjdC5jb20iLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE2NTAzNTI4MzksImV4cCI6MTY1MDM1NjQzOX0.1LADD_3iwvt52VdEXduOHg46TuptaPUD8t8tf954y9U",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNWU2Mjg1ZmFlMmIyNWY2ZGEzZDBmMCIsImZpcnN0bmFtZSI6IkFkbWluIiwibGFzdG5hbWUiOiJTS1kgRS1Db21tZXJjZSIsImVtYWlsIjoiYWRtaW5AbWFqb3ItcHJvamVjdC5jb20iLCJyb2xlcyI6WyJhZG1pbiJdLCJpYXQiOjE2NTAzNTI4MzksImV4cCI6MTY1MDk1NzYzOX0.6S3l3euhXt3bjM5Vxp8JqsNH6HJpibhYw2ri7yT6EdQ"
};

const user = {
  "firstname": "firstname",
  "lastname": "lastname",
  "email": "user@mail.com",
  "password": "$2b$10$cji1LASpAooOL7sUTne7GOGwd9XH4l5jDDPomGlPTDJRJvDJDuLH2",
  "roles": [
    "user"
  ],
  "profileImage": null,
  "currentHashedRefreshToken": "$2b$10$jX2ZUzkzaZI4GWx62xxNq.9HuW.aiZpmvpy0JW0o3Gq.5WQYBpO0.",
  "createdAt": "2022-04-19T07:19:33.666Z",
  "updatedAt": "2022-04-19T07:20:39.407Z",
  "id": "625e6285fae2b25f6da3d0f0"
};

const moduleMocker = new ModuleMocker(global);

describe('AuthService', () => {
  const userId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId(user.id) as unknown as mongoose.Schema.Types.ObjectId;

  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService]
    })
      .useMocker((token) => {
        if (token === UsersService) {
          return {
            create: jest.fn().mockResolvedValue(user),
            findById: jest.fn().mockResolvedValue(user),
            update: jest.fn().mockResolvedValue(user)
          };
        }
        if (token === JwtService) {
          return {
            signAsync: jest.fn().mockResolvedValue(tokens.accessToken),
            verifyAsync: jest.fn().mockResolvedValue(true)
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(token);
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })
      .compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(jwtService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should call findOneByEmail method on the users service', async () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue(user);
      await authService.validateUser({
        email: user.email,
        password: "password"
      });
      expect(usersService.findOneByEmail).toHaveBeenCalled();
    });

    it('should call findOneByEmail method on the users service with user email', async () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue(user);
      await authService.validateUser({
        email: user.email,
        password: "password"
      });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(user.email);
    });

    it('should throw exception if password does not match', () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue(user);
      expect(authService.validateUser({
        email: user.email,
        password: "newPassword"
      })).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });

    it('should return user', () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue(user);
      expect(authService.validateUser({
        email: user.email,
        password: "password"
      })).resolves.toEqual(user).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('signup', () => {
    it('should call findOneByEmail and create methods on the users service', async () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue(undefined);
      await authService.signup({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password",
        confirmPassword: "password"
      });
      expect(usersService.findOneByEmail).toHaveBeenCalled();
      expect(usersService.create).toHaveBeenCalled();
    });

    it('should call findOneByEmail method with users email, and create method with signup auth dto', async () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue(undefined);
      await authService.signup({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password",
        confirmPassword: "password"
      });
      expect(usersService.findOneByEmail).toHaveBeenCalledWith(user.email);
      expect(usersService.create).toHaveBeenCalledWith({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password",
        confirmPassword: "password"
      });
    });

    it('should throw an exception if passwords does not match', () => {
      expect(authService.signup({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password",
        confirmPassword: "confirmPassword"
      })).rejects.toThrow(new BadRequestException('Passwords must be same'));
    });

    it('should throw an exception if email already exists', () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue(user);
      expect(authService.signup({
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        password: "password",
        confirmPassword: "password"
      })).rejects.toThrow(new BadRequestException('Email already exists'));
    });

    it('should create a new user and return tokens', () => {
      usersService.findOneByEmail = jest.fn().mockResolvedValue(false);
      authService.signin = jest.fn().mockResolvedValue(tokens);
      expect(authService.signup({
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
    it('should return tokens', () => {
      authService.signin = jest.fn().mockResolvedValue(tokens);
      expect(authService.signin({
        ...user,
        _id: userId,
        password: '',
        roles: []
      })).resolves.toEqual(tokens).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('getCurrentUser', () => {
    it('should call findById method on the users service', async () => {
      await authService.getCurrentUser(userId);
      expect(usersService.findById).toHaveBeenCalled();
    });

    it('should call findById method on the users service with user id', async () => {
      await authService.getCurrentUser(userId);
      expect(usersService.findById).toHaveBeenCalledWith(userId);
    });

    it('should return current user', () => {
      expect(authService.getCurrentUser(userId)).resolves.toEqual(user).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('signout', () => {
    it('should call findById and update methods on the users service', async () => {
      await authService.signout(userId);
      expect(usersService.findById).toHaveBeenCalled();
      expect(usersService.update).toHaveBeenCalled();
    });

    it('should call findById method with user id, and update method with user id and update user dto', async () => {
      await authService.signout(userId);
      expect(usersService.findById).toHaveBeenCalledWith(userId);
      expect(usersService.update).toHaveBeenCalledWith(userId, {
        currentHashedRefreshToken: null
      });
    });
  });

  describe('refreshAccessToken', () => {
    it('should call findById method on the users service', async () => {
      await authService.refreshAccessToken(userId, tokens.refreshToken);
      expect(usersService.findById).toHaveBeenCalled();
    });

    it('should call findById method on the users service with user id', async () => {
      await authService.refreshAccessToken(userId, tokens.refreshToken);
      expect(usersService.findById).toHaveBeenCalledWith(userId);
    });

    it('should return access token', () => {
      authService.refreshAccessToken = jest.fn().mockResolvedValue({ accessToken: tokens.accessToken });
      expect(authService.refreshAccessToken(userId, tokens.refreshToken)).resolves.toEqual({ accessToken: tokens.accessToken }).catch((err) => {
        console.log(err);
      });
    });
  });

  describe('verifyToken', () => {
    it('should call verifyAsync method on the jwt service', async () => {
      await authService.verifyToken(tokens.accessToken);
      expect(jwtService.verifyAsync).toHaveBeenCalled();
    });

    it('should call verifyAsync method on the jwt service with token', async () => {
      await authService.verifyToken(tokens.accessToken);
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(tokens.accessToken);
    });

    it('should return true', () => {
      expect(authService.verifyToken(tokens.accessToken)).resolves.toEqual(true).catch((err) => {
        console.log(err);
      });
    });
  });
});