import { EmailTemplateDatabaseLibModule } from '@email-template-database-lib';
import { Module } from '@nestjs/common';
import { EmailTemplateServiceLibService } from './email-template-service-lib.service';

@Module({
    imports: [EmailTemplateDatabaseLibModule],
    providers: [EmailTemplateServiceLibService],
    exports: [EmailTemplateServiceLibService],
})
export class EmailTemplateServiceLibModule { }
