import { AwsSqsLibModule } from '@aws-sqs-lib';
import { CognitoLibModule } from '@cognito-lib';
import { CoreLibModule } from '@core-lib';
import { MessageQueueAwsSqsService, MessageQueueLibModule } from '@message-queue-lib';
import { Module } from '@nestjs/common';
import { UserDatabaseDynamodbLibModule } from '@user-database-dynamodb-lib';
import { AuthenticationServiceLibService } from './authentication-service-lib.service';

@Module({
    imports: [CoreLibModule,
        MessageQueueLibModule,
        UserDatabaseDynamodbLibModule,
        CognitoLibModule,
        AwsSqsLibModule
    ],
    providers: [AuthenticationServiceLibService,
        {
            provide: 'MessageQueueAwsSqsService',
            useClass: MessageQueueAwsSqsService,
        },
    ],
    exports: [AuthenticationServiceLibService],
})
export class AuthenticationServiceLibModule { }
