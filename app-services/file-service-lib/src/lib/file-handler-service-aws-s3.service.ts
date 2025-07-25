import { AwsS3LibService } from '@aws-s3-lib';
import { ResponseDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';
import { FileHandlerService } from './file-handler-service.abstract.class';

@Injectable()
export class FileHandlerAWSS3Service implements FileHandlerService {
    private readonly logger = new Logger(FileHandlerAWSS3Service.name);
    constructor(
        private readonly s3Service: AwsS3LibService
    ) { }



    async uploadViaSignedUrl(bucket: string, key: string, mimeType: string, expiration: number): Promise<ResponseDto<string>> {

        this.logger.log(`Generating Upload Signed Url for ${bucket} with key ${key} and mimeType ${mimeType} and expiration ${expiration} seconds`);

        try {
            const url = await this.s3Service.getUploadSignedUrl(
                bucket,
                key,
                mimeType,
                expiration
            );

            return new ResponseDto<string>(200, url);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            this.logger.error(error);

            return new ResponseDto<string>(400, error.message);
        }


    }

    async downloadFileViaUrl(bucket: string, key: string, mimeType: string, expiration: number): Promise<ResponseDto<string>> {


        this.logger.log(`Generating Download Signed Url for ${bucket} with key ${key} and mimeType ${mimeType} and expiration ${expiration} seconds`);


        try {
            const url = await this.s3Service.getDownloadSignedUrl(
                bucket,
                key,
                mimeType,
                expiration
            );

            return new ResponseDto<string>(200, url);

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            this.logger.error(error);

            return new ResponseDto<string>(400, error.message);
        }
    }
}
