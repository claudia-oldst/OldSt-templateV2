import { AwsS3LibModule } from '@aws-s3-lib';
import { Module } from '@nestjs/common';
import { FileHandlerAWSS3Service } from './file-handler-service-aws-s3.service';

@Module({
    imports: [AwsS3LibModule],
    providers: [FileHandlerAWSS3Service],
    exports: [FileHandlerAWSS3Service],
})
export class FileHandlerServiceLibModule { }
