import { Module } from '@nestjs/common';
import { AwsS3LibService } from './aws-s3-lib.service';

@Module({
    controllers: [],
    providers: [AwsS3LibService],
    exports: [AwsS3LibService],
})
export class AwsS3LibModule {}
