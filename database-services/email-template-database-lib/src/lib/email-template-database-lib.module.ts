import { DynamoDbLibModule } from '@dynamo-db-lib';
import { Module } from '@nestjs/common';
import { EmailTemplateDatabaseLibService } from './email-template-database-lib.service';

@Module({
    imports: [DynamoDbLibModule],
    providers: [EmailTemplateDatabaseLibService],
    exports: [EmailTemplateDatabaseLibService],
})
export class EmailTemplateDatabaseLibModule { }
