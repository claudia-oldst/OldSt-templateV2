import { AwsSesLibModule } from '@aws-ses-lib';
import { Module } from '@nestjs/common';
import { EmailAWSSesService } from './email-lib.service.aws.ses';

@Module({
    imports: [AwsSesLibModule],
    providers: [EmailAWSSesService],
    exports: [EmailAWSSesService],
})
export class EmailServiceLibModule { }
