import { CoreLibModule } from '@core-lib';
import { Module } from '@nestjs/common';

import { LogServiceLibModule } from '@log-service-lib';
import { AppService } from './app.service';

@Module({
    imports: [LogServiceLibModule, CoreLibModule],
    controllers: [],
    providers: [AppService],
})
export class AppModule { }
