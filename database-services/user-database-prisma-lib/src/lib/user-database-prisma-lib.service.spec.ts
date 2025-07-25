import { Test } from '@nestjs/testing';
import { UserDatabasePrismaLibService } from './user-database-prisma-lib.service';

describe('UserDatabasePrismaLibService', () => {
    let service: UserDatabasePrismaLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserDatabasePrismaLibService],
        }).compile();

        service = module.get(UserDatabasePrismaLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
