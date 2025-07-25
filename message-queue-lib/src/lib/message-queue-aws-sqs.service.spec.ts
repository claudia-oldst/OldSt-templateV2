import { AwsSqsLibService } from '@aws-sqs-lib';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { MessageQueueAwsSqsService } from './message-queue-aws-sqs.service';

describe('MessageQueueAwsSqsService', () => {
    let service: MessageQueueAwsSqsService;

    const mockAwsSqsLibService = {
        sendMessage: jest.fn().mockImplementation((queueUrl: string) => {


            if (queueUrl === 'success-destination') {
                return Promise.resolve();
            } else {
                return Promise.reject(new BadRequestException('Unable to send sqs message'));
            }
        }),

    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                MessageQueueAwsSqsService,
                { provide: AwsSqsLibService, useValue: mockAwsSqsLibService },
            ],
        }).compile();

        service = module.get<MessageQueueAwsSqsService>(MessageQueueAwsSqsService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });



    it('should return send sqs message', async () => {


        const result = await service.sendMessage('success-destination', 'message');

        expect(result.statusCode).toEqual(200);
        expect(mockAwsSqsLibService.sendMessage).toBeCalled();
    });

    it('should NOT return send sqs message', async () => {


        const result = await service.sendMessage('xxxx-destination', 'message');

        expect(result.statusCode).toEqual(400);
        expect(mockAwsSqsLibService.sendMessage).toBeCalled();
    });




});
