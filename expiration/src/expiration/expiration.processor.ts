// NestJS   
import { Process, Processor } from '@nestjs/bull';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

// Other Dependencies
import { Job } from 'bull';


@Injectable()
@Processor('expiration')
export class ExpirationProcessor {
  constructor(@Inject('EXPIRATION_ORDERS_SERVICE') private readonly client: ClientProxy) { }

  @Process('expireOrder')
  async handleExpireOrder(job: Job) {
    this.client.emit('expiredOrder', job.data.orderId);
  }
}