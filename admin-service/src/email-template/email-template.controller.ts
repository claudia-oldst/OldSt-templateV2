import { ApiKeyHeaderGuard } from '@auth-guard-lib';
import { EmailTemplateDto } from '@dto';
import { EmailTemplateServiceLibService } from '@email-template-service-lib';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiTags } from '@nestjs/swagger';

@Controller('email-template')
@ApiTags('email-template')
export class EmailTemplateController {
    constructor(private readonly emailTemplateService: EmailTemplateServiceLibService) { }

    @Post()
    @ApiHeader({
        name: 'X-API-KEY',
    })
    @UseGuards(ApiKeyHeaderGuard)
    create(@Body() data: EmailTemplateDto) {
        return this.emailTemplateService.createRecord(data);
    }

    @Get('/template-type/:templateType/language/:language')
    getByEmail(@Param('templateType') templateType: string, @Param('language') language: string) {
        return this.emailTemplateService.findByTemplateTypeAndLanguage(templateType, language);
    }
}
