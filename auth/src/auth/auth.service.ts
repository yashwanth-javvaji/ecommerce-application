// NestJS
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

// Common
import { JwtPayloadDto } from '@yj-major-project/common';

// Other Dependencies
import * as bcrypt from 'bcrypt';
import { ObjectId } from "mongoose";

// Custom
// DTOs
import { AccessTokenDto } from './dto/access-token.dto';
import { SigninAuthDto } from './dto/signin.dto';
import { SignupAuthDto } from './dto/signup.dto';
import { TokensDto } from './dto/tokens.dto';
// Schemas
import { User } from '../users/schemas/user.schema';
// Services
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService
    ) { }

    private async createAccessToken(jwtPayloadDto: JwtPayloadDto): Promise<string> {
        return await this.jwtService.signAsync(jwtPayloadDto, {
            secret: process.env.JWT_ACCESS_TOKEN_SECRET,
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME
        });
    }

    private async createRefreshToken(jwtPayloadDto: JwtPayloadDto): Promise<string> {
        return await this.jwtService.signAsync(jwtPayloadDto, {
            secret: process.env.JWT_REFRESH_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME
        });
    }

    private async getTokens(jwtPayloadDto: JwtPayloadDto): Promise<TokensDto> {
        return {
            accessToken: await this.createAccessToken(jwtPayloadDto),
            refreshToken: await this.createRefreshToken(jwtPayloadDto)
        };
    }

    private async updateRefreshToken(id: ObjectId, refreshToken: string) {
        const currentHashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersService.update(id, {
            currentHashedRefreshToken
        });
    }

    public async validateUser(signInAuthDto: SigninAuthDto): Promise<User> {
        const { email, password } = signInAuthDto;
        const user = await this.usersService.findOneByEmail(email);
        if (!(await bcrypt.compare(password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return user;
    }

    public async signup(signupAuthDto: SignupAuthDto): Promise<TokensDto> {
        if (signupAuthDto.password !== signupAuthDto.confirmPassword) {
            throw new BadRequestException('Passwords must be same');
        }
        if (await this.usersService.findOneByEmail(signupAuthDto.email)) {
            throw new BadRequestException('Email already exists');
        }
        const user = await this.usersService.create(signupAuthDto);
        return await this.signin(user);
    }

    public async signin(user: User): Promise<TokensDto> {
        const jwtPayload = (({ _id: id, firstname, lastname, email, roles }) => ({ id, firstname, lastname, email, roles }))(user);
        const tokens = await this.getTokens(jwtPayload);
        await this.updateRefreshToken(user._id, tokens.refreshToken);
        return tokens;
    }

    public async getCurrentUser(id: ObjectId): Promise<User> {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.currentHashedRefreshToken) {
            throw new UnauthorizedException('Please login');
        }
        return user;
    }

    public async signout(id: ObjectId) {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.currentHashedRefreshToken) {
            throw new UnauthorizedException('Please login');
        }
        await this.usersService.update(id, {
            currentHashedRefreshToken: null
        });
    }

    public async refreshAccessToken(id: ObjectId, refreshToken: string): Promise<AccessTokenDto> {
        const user = await this.usersService.findById(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        if (!user.currentHashedRefreshToken) {
            throw new UnauthorizedException('Please login');
        }
        if (!(await bcrypt.compare(refreshToken, user.currentHashedRefreshToken))) {
            throw new UnauthorizedException('Invalid token');
        }
        const jwtPayload = (({ _id: id, firstname, lastname, email, roles }) => ({ id, firstname, lastname, email, roles }))(user);
        return {
            accessToken: await this.createAccessToken(jwtPayload),
        };
    }

    public async verifyToken(token: string): Promise<any> {
        return await this.jwtService.verifyAsync(token);
    }
}