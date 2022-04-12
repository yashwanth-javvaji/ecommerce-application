// NestJS
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';

// Custom
// Controllers
import { UsersController } from './users.controller';
// Schemas
import { User, UserSchema } from './schemas/user.schema';
// Services
import { UsersService } from './users.service';


@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USERS_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqps://wjdovbpn:boXVmPjKWIlMJ0xaTBqm_5jBgA36EuSg@lionfish.rmq.cloudamqp.com/wjdovbpn'],
          queue: 'users_queue',
          queueOptions: {
            durable: false
          }
        }
      }
    ]),
    MongooseModule.forFeature([{name: User.name, schema: UserSchema}])
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
