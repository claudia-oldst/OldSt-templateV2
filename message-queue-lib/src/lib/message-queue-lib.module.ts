import { AwsSqsLibModule } from '@aws-sqs-lib';
import { Module } from '@nestjs/common';
import { MessageQueueAwsSqsService } from './message-queue-aws-sqs.service';

@Module({
    imports: [AwsSqsLibModule],
    providers: [MessageQueueAwsSqsService],
    exports: [MessageQueueAwsSqsService],
})
export class MessageQueueLibModule { }
