import { Module } from '@nestjs/common';
import { AwsSecretManagerLibService } from './aws-secret-manager-lib.service';

@Module({
    controllers: [],
    providers: [AwsSecretManagerLibService],
    exports: [AwsSecretManagerLibService],
})
export class AwsSecretManagerLibModule {}
