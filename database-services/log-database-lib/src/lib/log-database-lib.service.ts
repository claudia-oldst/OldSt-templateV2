import { LogsDto } from '@dto';
import { DynamoDbService, LogDataType } from '@dynamo-db-lib';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogDatabaseLibService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private logsTable: any = null;

    constructor(private readonly dynamoDbService: DynamoDbService) {
        this.logsTable = this.dynamoDbService
            .dynamoDbMainTable()
            .getModel('Logs');
    }

    async createRecord(data: LogsDto): Promise<LogDataType> {


        const logData: LogDataType = {
            GSI1PK: data.entityName,
            GSI2PK: data.entityName,
            GSI1SK: data.referenceId,
            user: data.user,
            action: data.action,

            data: data.data,
        };

        return await this.logsTable.create(logData);
    }

}
