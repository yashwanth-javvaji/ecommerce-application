// NestJS
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

// Custom
// Controllers
import { AuthController } from './auth.controller';
// Modules
import { UsersModule } from '../users/users.module';
// Services
import { AuthService } from './auth.service';
// Strategies
import { LocalStrategy } from './strategies/local.strategy';


@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '30m' }
    }),
    UsersModule
  ],
  providers: [AuthService, LocalStrategy],
  controllers: [AuthController]
})
export class AuthModule { }
