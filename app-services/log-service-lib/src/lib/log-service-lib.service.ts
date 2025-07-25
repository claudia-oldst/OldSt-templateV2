import { LogsDto } from '@dto';
import { LogDatabaseLibService } from '@log-database-lib';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogServiceLibService {
    private readonly logger = new Logger(LogServiceLibService.name);
    constructor(private readonly logDbService: LogDatabaseLibService) {

    }

    async createRecord(data: LogsDto) {

        this.logger.log(`Creating Log Record for ${data.entityName} `);

        await this.logDbService.createRecord(data);
    }
}
