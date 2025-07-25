import { DynamoDbLibModule } from '@dynamo-db-lib';
import { Module } from '@nestjs/common';
import { UserDatabaseDynamodbLibService } from './user-database-dynamodb-lib.service';

@Module({
    imports: [DynamoDbLibModule],
    providers: [UserDatabaseDynamodbLibService],
    exports: [UserDatabaseDynamodbLibService],
})
export class UserDatabaseDynamodbLibModule { }
