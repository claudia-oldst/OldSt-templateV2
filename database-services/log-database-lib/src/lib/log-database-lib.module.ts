import { DynamoDbLibModule } from '@dynamo-db-lib';
import { Module } from '@nestjs/common';
import { LogDatabaseLibService } from './log-database-lib.service';

@Module({
    imports: [DynamoDbLibModule],
    providers: [LogDatabaseLibService],
    exports: [LogDatabaseLibService],
})
export class LogDatabaseLibModule { }
