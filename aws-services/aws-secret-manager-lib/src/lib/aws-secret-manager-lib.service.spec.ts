import { Test } from '@nestjs/testing';
import { AwsSecretManagerLibService } from './aws-secret-manager-lib.service';

describe('AwsSecretManagerLibService', () => {
    let service: AwsSecretManagerLibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AwsSecretManagerLibService],
        }).compile();

        service = module.get(AwsSecretManagerLibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
