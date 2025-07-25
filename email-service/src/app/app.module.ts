import { Module } from '@nestjs/common';

import { CoreLibModule } from '@core-lib';
import { EmailServiceModule } from '../email-service/email-service.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [CoreLibModule, EmailServiceModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
