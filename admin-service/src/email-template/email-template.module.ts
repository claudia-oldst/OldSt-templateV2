import { CognitoLibModule } from '@cognito-lib';
import { CoreLibModule } from '@core-lib';
import { EmailTemplateServiceLibModule } from '@email-template-service-lib';
import { Module } from '@nestjs/common';
import { EmailTemplateController } from './email-template.controller';

@Module({
    imports: [EmailTemplateServiceLibModule, CoreLibModule, CognitoLibModule],
    controllers: [EmailTemplateController],
    providers: [],
})
export class EmailTemplateModule { }
