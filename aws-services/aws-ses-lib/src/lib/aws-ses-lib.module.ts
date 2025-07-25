import { Module } from '@nestjs/common';
import { AwsSesLibService } from './aws-ses-lib.service';

@Module({
    controllers: [],
    providers: [AwsSesLibService],
    exports: [AwsSesLibService],
})
export class AwsSesLibModule {}
