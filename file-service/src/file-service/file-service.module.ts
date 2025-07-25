import { AwsS3LibModule } from '@aws-s3-lib';
import { FileHandlerAWSS3Service, FileHandlerServiceLibModule } from '@file-service-lib';
import { Module } from '@nestjs/common';
import { FileServiceController } from './file-service.controller';

@Module({
    imports: [FileHandlerServiceLibModule, AwsS3LibModule],
    controllers: [FileServiceController],
    providers: [

        {
            provide: 'FileHandlerAWSS3Service',
            useClass: FileHandlerAWSS3Service,
        },
    ],
})
export class FileServiceModule { }
