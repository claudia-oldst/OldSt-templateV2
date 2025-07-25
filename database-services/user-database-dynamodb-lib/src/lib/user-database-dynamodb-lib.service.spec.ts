import { Test } from '@nestjs/testing';
import { UserDatabaseDynamodbLibService } from './user-database-dynamodb-lib.service';

describe('UserDatabaseDynamodbLibService', () => {
    let service: UserDatabaseDynamodbLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserDatabaseDynamodbLibService],
        }).compile();

        service = module.get(UserDatabaseDynamodbLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
