// NestJS
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Custom
// Contollers
import { UsersController } from './users.controller';
// Schemas
import { User, UserSchema } from './schemas/user.schema';
// Services
import { UsersService } from './users.service';


@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UsersController],
  providers: [UsersService]
})
export class UsersModule { }