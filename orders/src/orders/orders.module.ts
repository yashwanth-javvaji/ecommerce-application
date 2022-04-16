// NestJS
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Custom
// Contollers
import { OrdersController } from './orders.controller';
// Schemas
import { Order, OrderSchema } from './schemas/order.schema';
// Services
import { OrdersService } from './orders.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])
  ],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule { }
