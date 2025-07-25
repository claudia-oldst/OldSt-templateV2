import { AwsSecretManagerLibModule } from '@aws-secret-manager-lib';
import { Module } from '@nestjs/common';
import { CognitoLibService } from './cognito-lib.service';

@Module({
    controllers: [],
    imports: [AwsSecretManagerLibModule],
    providers: [CognitoLibService],
    exports: [CognitoLibService],
})
export class CognitoLibModule { }
