// NestJS
import { getQueueToken } from '@nestjs/bull';
import { Test, TestingModule } from '@nestjs/testing';

// Other Dependencies
import { Queue } from 'bull';
import { ModuleMocker } from 'jest-mock';
import mongoose from 'mongoose';

// Custom
// Controllers
import { ExpirationController } from './expiration.controller';


const moduleMocker = new ModuleMocker(global);

describe('ExpirationController', () => {
    const orderId: mongoose.Schema.Types.ObjectId = new mongoose.Types.ObjectId("625b12cb391f05b6847691c2") as unknown as mongoose.Schema.Types.ObjectId;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    let controller: ExpirationController;
    let queue: Queue;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ExpirationController]
        })
            .useMocker((token) => {
                if (token === getQueueToken('expiration')) {
                    return {
                        add: jest.fn()
                    }
                }
                if (typeof token === 'function') {
                    const mockMetadata = moduleMocker.getMetadata(token);
                    const Mock = moduleMocker.generateFromMetadata(mockMetadata);
                    return new Mock();
                }
            })
            .compile();

        controller = module.get<ExpirationController>(ExpirationController);
        queue = module.get<Queue>(getQueueToken('expiration'));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
        expect(queue).toBeDefined();
    });

    describe('expire', () => {
        it('should call add method on the queue', async () => {
            await controller.expire({
                id: orderId,
                expiresAt
            });
            expect(queue.add).toHaveBeenCalled();
        });
        
        it('should call add method on the queue with job name, job, and delay', async () => {
            await controller.expire({
                id: orderId,
                expiresAt
            });
            expect(queue.add).toHaveBeenCalledWith('expireOrder', {
                orderId
            }, {
                delay: expect.any(Number)
            });
        });
    });
});