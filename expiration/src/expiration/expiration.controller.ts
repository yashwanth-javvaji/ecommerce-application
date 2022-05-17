// NestJS
import { InjectQueue } from '@nestjs/bull';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

// Other Dependencies
import { Queue } from 'bull';
import { ObjectId } from 'mongoose';


@Controller()
export class ExpirationController {
    constructor(@InjectQueue('expiration') private readonly expirationQueue: Queue) { }

    @EventPattern('orderExpire')
    async expire(@Payload() order: { id: ObjectId, expiresAt: Date }) {
        await this.expirationQueue.add('expireOrder', {
            orderId: order.id,
        }, {
            delay: new Date(order.expiresAt).getTime() - new Date().getTime()
        });
    }
}