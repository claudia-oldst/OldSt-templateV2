import { Module } from '@nestjs/common';
import { AwsSqsLibService } from './aws-sqs-lib.service';

@Module({
    controllers: [],
    providers: [AwsSqsLibService],
    exports: [AwsSqsLibService],
})
export class AwsSqsLibModule {}
