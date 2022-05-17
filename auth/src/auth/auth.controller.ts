// NestJS
import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';

// Common
import { CurrentUser, CurrentUserId, JwtRefreshTokenAuthGuard, Public } from '@yj-major-project/common';

// Other Dependencies
import { ObjectId } from 'mongoose';

// Custom
// DTOs
import { AccessTokenDto } from './dto/access-token.dto';
import { SignupAuthDto } from './dto/signup.dto';
import { TokensDto } from './dto/tokens.dto';
// Guards
import { LocalAuthGuard } from './guards/local-auth.guard';
// Schemas
import { User } from '../users/schemas/user.schema';
// Services
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Public()
  @Post('signup')
  async signup(@Body() signupAuthDto: SignupAuthDto): Promise<TokensDto> {
    return await this.authService.signup(signupAuthDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req): Promise<TokensDto> {
    return await this.authService.signin(req.user);
  }

  @Get('current-user')
  async currentUser(@Request() req): Promise<User> {
    return await this.authService.getCurrentUser(req.user.id);
  }

  @Post('signout')
  async signout(@CurrentUserId() id: ObjectId, @Request() req) {
    await this.authService.signout(id);
    req.logout();
  }

  @Public()
  @UseGuards(JwtRefreshTokenAuthGuard)
  @Post('refresh-access-token')
  async refreshAccessToken(@CurrentUserId() id: ObjectId, @CurrentUser('refreshToken') refreshToken: string): Promise<AccessTokenDto> {
    return await this.authService.refreshAccessToken(id, refreshToken);
  }

  @Public()
  @Post('verify-token/:token')
  async verifyToken(@Param('token') token: string): Promise<any> {
    return await this.authService.verifyToken(token);
  }
}