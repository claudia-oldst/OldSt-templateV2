import { AuthGuardLibModule } from '@auth-guard-lib';
import { AwsSqsLibModule } from '@aws-sqs-lib';
import { CognitoLibModule } from '@cognito-lib';
import { CoreLibModule } from '@core-lib';
import { MessageQueueAwsSqsService, MessageQueueLibModule } from '@message-queue-lib';
import { Module } from '@nestjs/common';
import { UserDatabaseDynamodbLibModule } from '@user-database-dynamodb-lib';
import { UserDatabasePrismaLibModule } from '@user-database-prisma-lib';
import { UserServiceDynamoLibService, UserServiceLibModule, UserServicePrismaLibService } from '@user-service-lib';
import { UserDynamoDbController } from './user.dynamodb.controller';
import { UserPrismaDbController } from './user.prisma.controller';

@Module({
    imports: [
        CoreLibModule,
        AuthGuardLibModule,
        UserServiceLibModule,
        CognitoLibModule,
        UserDatabasePrismaLibModule,
        UserDatabaseDynamodbLibModule,
        MessageQueueLibModule,
        AwsSqsLibModule
    ],
    controllers: [UserDynamoDbController, UserPrismaDbController],
    providers: [

        {
            provide: 'UserServicePrismaLibService',
            useClass: UserServicePrismaLibService,
        },

        {
            provide: 'UserServiceDynamoLibService',
            useClass: UserServiceDynamoLibService,
        },
        {
            provide: 'MessageQueueAwsSqsService',
            useClass: MessageQueueAwsSqsService,
        },
    ],
})
export class UserModule { }
