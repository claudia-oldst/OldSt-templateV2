import { AwsSqsLibService } from '@aws-sqs-lib';
import { ResponseDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';
import { MessageQueueService } from './message-queue.abstract.class';

@Injectable()
export class MessageQueueAwsSqsService implements MessageQueueService {

    private readonly logger = new Logger(MessageQueueAwsSqsService.name);
    constructor(private readonly sqsService: AwsSqsLibService) {

    }


    async sendMessage(destination: string, message: string): Promise<ResponseDto<string>> {

        if (!destination || destination == '') {
            throw new Error('Queue URL is not defined');
        }

        try {
            await this.sqsService.sendMessage(destination, message);

            return new ResponseDto(200, `Message sent to queue ${destination}`);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            this.logger.error(error);

            return new ResponseDto(400, error.message);
        }
    }



}