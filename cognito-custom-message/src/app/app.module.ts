import { Module } from '@nestjs/common';

import { CoreLibModule } from '@core-lib';
import { EmailTemplateServiceLibModule } from '@email-template-service-lib';
import { AppService } from './app.service';

@Module({
    imports: [CoreLibModule, EmailTemplateServiceLibModule],
    controllers: [],
    providers: [AppService],
})
export class AppModule { }
