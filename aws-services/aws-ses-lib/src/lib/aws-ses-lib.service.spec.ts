import { Test } from '@nestjs/testing';
import { AwsSesLibService } from './aws-ses-lib.service';

describe('AwsSesLibService', () => {
    let service: AwsSesLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AwsSesLibService],
        }).compile();

        service = module.get(AwsSesLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
