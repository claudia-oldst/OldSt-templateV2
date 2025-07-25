import { Test } from '@nestjs/testing';
import { LogDatabaseLibService } from './log-database-lib.service';

describe('LogDatabaseLibService', () => {
    let service: LogDatabaseLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [LogDatabaseLibService],
        }).compile();

        service = module.get(LogDatabaseLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
