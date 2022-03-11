// Nest
import { Body, ClassSerializerInterceptor, Controller, Get, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';

// YJ
import { CurrentUser, CurrentUserId, JwtRefreshTokenAuthGuard, Public } from '@yj-major-project/common';

// Other Dependencies
import { ObjectID } from 'typeorm';

// Custom
// Services
import { AuthService } from './auth.service';
// DTOs
import { SignupAuthDto } from './dto/signup-auth.dto';
// Guards
import { LocalAuthGuard } from './guards/local-auth.guard';


@UseInterceptors(ClassSerializerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Public()
  @Post('signup')
  async signup(@Body() signupAuthDto: SignupAuthDto) {
    return await this.authService.signup(signupAuthDto);
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Request() req) {
    return await this.authService.signin(req.user);
  }

  @Get('current-user')
  currentUser(@CurrentUserId() userId: ObjectID) {
    return this.authService.currentUser(userId);
  }

  @Post('signout')
  async signout(@CurrentUserId() userId: ObjectID, @Request() req) {
    await this.authService.signout(userId);
    req.logout();
  }

  @Public()
  @UseGuards(JwtRefreshTokenAuthGuard)
  @Post('refresh-token')
  async refreshTokens(@CurrentUserId() userId: ObjectID, @CurrentUser('refreshToken') refreshToken: string) {
    return await this.authService.refreshToken(userId, refreshToken);
  }
}
