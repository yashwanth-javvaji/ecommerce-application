// NestJS
import { ClientProxy } from '@nestjs/microservices';
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import mongoose from 'mongoose';

// Custom
// Processors
import { ExpirationProcessor } from './expiration.processor';

class Client {
    static emit = jest.fn().mockResolvedValue(true);
}

describe('ExpirationProcessor', () => {
    const orderId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId("625b12cb391f05b6847691c2") as unknown as mongoose.Schema.Types.ObjectId;
    
    let processor: ExpirationProcessor;
    let client: ClientProxy;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ExpirationProcessor,
                {
                    provide: 'EXPIRATION_ORDERS_SERVICE',
                    useValue: Client
                }
            ]
        }).compile();

        processor = module.get<ExpirationProcessor>(ExpirationProcessor);
        client = module.get<ClientProxy>('EXPIRATION_ORDERS_SERVICE');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(client).toBeDefined();
    });

    describe('handleExpireOrder', () => {
        it('should call emit method on the client', async () => {
            await processor.handleExpireOrder({
                data: {
                    orderId
                }
            });
            expect(client.emit).toHaveBeenCalled();
        });
    });
});