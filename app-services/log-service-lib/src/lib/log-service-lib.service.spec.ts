import { LogsDto } from '@dto';
import { LogDataType } from '@dynamo-db-lib';
import { LogDatabaseLibService } from '@log-database-lib';
import { Test } from '@nestjs/testing';
import { LogServiceLibService } from './log-service-lib.service';

describe('LogServiceLibService', () => {
    let service: LogServiceLibService;

    const mockEmailTemplateDBService = {

        createRecord: jest.fn().mockImplementation(() => {
            const response: LogDataType = {
                logId: '1234567890'

            };

            return response;
        }),

    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [LogServiceLibService, LogDatabaseLibService],
        })
            .overrideProvider(LogDatabaseLibService)
            .useValue(mockEmailTemplateDBService)
            .compile();

        service = module.get(LogServiceLibService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });

    it('should create a record', async () => {
        const data: LogsDto = new LogsDto();

        data.entityName = 'entityName';
        data.referenceId = 'referenceId';
        data.action = 'action';
        await service.createRecord(data);

        expect(mockEmailTemplateDBService.createRecord).toBeCalled();
    });

});
