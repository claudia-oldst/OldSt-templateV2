import { Module } from '@nestjs/common';

import { EmailTemplateModule } from '../email-template/email-template.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [EmailTemplateModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
