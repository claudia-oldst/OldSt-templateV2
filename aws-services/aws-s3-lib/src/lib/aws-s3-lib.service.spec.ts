import { Test } from '@nestjs/testing';
import { AwsS3LibService } from './aws-s3-lib.service';

describe('AwsS3LibService', () => {
    let service: AwsS3LibService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AwsS3LibService],
        }).compile();

        service = module.get(AwsS3LibService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });
});
