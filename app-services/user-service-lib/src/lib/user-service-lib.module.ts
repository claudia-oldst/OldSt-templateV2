import { AwsSqsLibModule } from '@aws-sqs-lib';
import { MessageQueueLibModule } from '@message-queue-lib';
import { Module } from '@nestjs/common';
import { UserDatabaseDynamodbLibModule } from '@user-database-dynamodb-lib';
import { UserDatabasePrismaLibModule } from '@user-database-prisma-lib';
import { UserServiceDynamoLibService } from './user-service-dynamo-lib.service';
import { UserServicePrismaLibService } from './user-service-primsa-lib.service';

@Module({
    imports: [UserDatabasePrismaLibModule, UserDatabaseDynamodbLibModule, MessageQueueLibModule, AwsSqsLibModule],
    providers: [
        UserServicePrismaLibService,
        UserServiceDynamoLibService
    ],
    exports: [UserServicePrismaLibService, UserServiceDynamoLibService
    ],
})
export class UserServiceLibModule { }

