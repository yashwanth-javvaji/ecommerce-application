// Nest
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Custom
// Controllers
import { UsersController } from './users.controller';
// Entities
import { User } from './entities/user.entity';
// Services
import { UsersService } from './users.service';


@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
