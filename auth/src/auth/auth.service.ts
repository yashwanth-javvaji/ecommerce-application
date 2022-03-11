// Nest
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// YJ
import { PayloadDto } from '@yj-major-project/common';

// Other Dependencies
import * as bcrypt from 'bcrypt';
import { ObjectID } from 'typeorm';

// Custom
// DTOs
import { SigninAuthDto } from './dto/signin-auth.dto';
import { SignupAuthDto } from './dto/signup-auth.dto';
import { TokensDto } from './dto/tokens.dto';
// Entitites
import { User } from 'src/users/entities/user.entity';
// Services
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async generateAccessToken(payload: PayloadDto): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_KEY,
      expiresIn: '1h'
    });
  }

  async generateRefreshToken(payload: PayloadDto): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_KEY,
      expiresIn: '7d'
    });
  }

  async getTokens(payload: PayloadDto): Promise<TokensDto> {
    return {
      accessToken: await this.generateAccessToken(payload),
      refreshToken: await this.generateRefreshToken(payload)
    }
  }

  async updateRefreshToken(userId: ObjectID, refreshToken: string) {
    const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
    await this.usersService.update(userId, {
      currentHashedRefreshToken
    });
  }

  async validateUser(signInAuthDto: SigninAuthDto): Promise<User> {
    const { email, password } = signInAuthDto;

    const user = await this.usersService.findOneByEmail(email);

    if (!(await user?.validatePassword(password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  async signup(signupAuthDto: SignupAuthDto): Promise<TokensDto> {
    if (signupAuthDto.password !== signupAuthDto.confirmPassword) {
      throw new BadRequestException('Passwords must be same');
    }

    if (await this.usersService.findOneByEmail(signupAuthDto.email)) {
      throw new BadRequestException('Email already exist');
    }

    const user = await this.usersService.create(signupAuthDto);

    return await this.signin(user);
  }

  async signin(user: User) {
    const tokens = await this.getTokens({ userId: user.id })

    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async currentUser(userId: ObjectID) {
    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.currentHashedRefreshToken) {
      throw new UnauthorizedException('Please login');
    }

    return user;
  }

  async signout(userId: ObjectID) {
    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersService.update(userId, {
      currentHashedRefreshToken: null
    });
  }

  async refreshToken(userId: ObjectID, refreshToken: string) {
    const user = await this.usersService.findOneById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (!user.currentHashedRefreshToken) {
      throw new UnauthorizedException('Please login');
    }

    if (!await bcrypt.compare(refreshToken, user.currentHashedRefreshToken)) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      accessToken: await this.generateRefreshToken({ userId })
    };
  }
}
