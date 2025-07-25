import { AwsSesLibModule } from '@aws-ses-lib';
import { EmailAWSSesService, EmailServiceLibModule } from '@email-service-lib';
import { Module } from '@nestjs/common';
import { EmailServiceController } from './email-service.controller';

@Module({
    imports: [EmailServiceLibModule, AwsSesLibModule],
    controllers: [EmailServiceController],
    providers: [

        {
            provide: 'EmailAWSSesService',
            useClass: EmailAWSSesService,
        },
    ]

})
export class EmailServiceModule { }
