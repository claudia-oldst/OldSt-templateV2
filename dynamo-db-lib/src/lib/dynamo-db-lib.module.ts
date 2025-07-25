import { Module } from '@nestjs/common';
import { DynamoDbService } from './dynamodb.service';

@Module({
    controllers: [],
    providers: [DynamoDbService],
    exports: [DynamoDbService],
})
export class DynamoDbLibModule {}
