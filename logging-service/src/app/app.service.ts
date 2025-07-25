import { LogsDto } from '@dto';
import { LogServiceLibService } from '@log-service-lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);
    constructor(private readonly loggingService: LogServiceLibService) { }
    getData(): { message: string } {
        return { message: 'Welcome to logging-service!' };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleMessage(records: any) {
        this.logger.log(`Record Value: ${JSON.stringify(records)}`);

        for (const record of records) {
            this.logger.log(`Processing SQS Message: ${JSON.stringify(record)}`);

            const data: LogsDto = JSON.parse(record.body);

            this.logger.log(`Log Data: ${JSON.stringify(data)}`);

            await this.loggingService.createRecord(data);
        }
    }


}
