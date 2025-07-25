import { AwsS3LibService } from '@aws-s3-lib';
import { ResponseDto } from '@dto';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { FileHandlerAWSS3Service } from './file-handler-service-aws-s3.service';

describe('FileHandlerAWSS3Service', () => {
    let service: FileHandlerAWSS3Service;

    const mockAwsS3LibService = {
        getDownloadSignedUrl: jest.fn().mockImplementation((bucket: string) => {

            if (bucket === 'test-bucket') {
                return new ResponseDto<string>(200, 'https://example.com/signed-url');
            } else {
                return Promise.reject(new BadRequestException('Unable to get signed url'));
            }

        }),
        getUploadSignedUrl: jest.fn().mockImplementation((bucket: string) => {

            if (bucket === 'test-bucket') {
                return new ResponseDto<string>(200, 'https://example.com/signed-url');
            } else {
                return Promise.reject(new BadRequestException('Unable to get signed url'));
            }
        }),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                FileHandlerAWSS3Service,
                { provide: AwsS3LibService, useValue: mockAwsS3LibService },
            ],
        }).compile();

        service = module.get<FileHandlerAWSS3Service>(FileHandlerAWSS3Service);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });



    it('Download Url should return a signed URL', async () => {
        const bucket = 'test-bucket';
        const key = 'test-key';
        const mimeType = 'application';
        const expiration = 3600;

        const result = await service.downloadFileViaUrl(bucket, key, mimeType, expiration);

        expect(result.statusCode).toEqual(200);
        expect(mockAwsS3LibService.getDownloadSignedUrl).toHaveBeenCalledWith(bucket, key, mimeType, expiration);
    });

    it('Download Url  should return not return a URL', async () => {
        const bucket = 'error-bucket';
        const key = 'test-key';
        const mimeType = 'application';
        const expiration = 3600;

        const result = await service.downloadFileViaUrl(bucket, key, mimeType, expiration);

        expect(result.statusCode).toEqual(400);
        expect(mockAwsS3LibService.getDownloadSignedUrl).toHaveBeenCalledWith(bucket, key, mimeType, expiration);
    });

    it('Upload Url should return a signed URL', async () => {
        const bucket = 'test-bucket';
        const key = 'test-key';
        const mimeType = 'application';
        const expiration = 3600;

        const result = await service.uploadViaSignedUrl(bucket, key, mimeType, expiration);

        expect(result.statusCode).toEqual(200);
        expect(mockAwsS3LibService.getUploadSignedUrl).toHaveBeenCalledWith(bucket, key, mimeType, expiration);
    });

    it('upload Url  should return not return a URL', async () => {
        const bucket = 'error-bucket';
        const key = 'test-key';
        const mimeType = 'application';
        const expiration = 3600;

        const result = await service.uploadViaSignedUrl(bucket, key, mimeType, expiration);

        expect(result.statusCode).toEqual(400);
        expect(mockAwsS3LibService.getUploadSignedUrl).toHaveBeenCalledWith(bucket, key, mimeType, expiration);
    });
});
