import { Module } from '@nestjs/common';

import { CoreLibModule } from '@core-lib';
import { FileServiceModule } from '../file-service/file-service.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [CoreLibModule, FileServiceModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
