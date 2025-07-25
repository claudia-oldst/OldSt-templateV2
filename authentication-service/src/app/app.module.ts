import { Module } from '@nestjs/common';

import { CognitoLibModule } from '@cognito-lib';
import { CoreLibModule } from '@core-lib';
import { AppService } from './app.service';

@Module({
    imports: [CoreLibModule, CognitoLibModule],
    controllers: [],
    providers: [AppService],
})
export class AppModule {}
