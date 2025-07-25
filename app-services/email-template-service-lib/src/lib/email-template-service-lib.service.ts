import { EmailTemplateDataDto, EmailTemplateDto, EmailTemplateType, ResponseDto } from '@dto';
import { EmailTemplateDataType } from '@dynamo-db-lib';
import { EmailTemplateDatabaseLibService } from '@email-template-database-lib';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class EmailTemplateServiceLibService {
    private readonly logger = new Logger(EmailTemplateServiceLibService.name);
    constructor(private readonly emailTemplateDBService: EmailTemplateDatabaseLibService) {

    }

    async createRecord(data: EmailTemplateDto): Promise<ResponseDto<EmailTemplateDto>> {

        this.logger.log(`Creating Email Template Record for ${data.emailTemplateType} and ${data.language} with subject ${data.subject} and body ${data.data}`);

        const existingRecord: ResponseDto<EmailTemplateDto> = await this.findByTemplateTypeAndLanguage(
            data.emailTemplateType, data.language
        );


        if (existingRecord.statusCode === 200) {
            await this.emailTemplateDBService.deleteById(existingRecord.body.emailTemplateId);
        }

        const record = await this.emailTemplateDBService.createRecord(data);

        return new ResponseDto<EmailTemplateDto>(201, await this.convertToDto(record));
    }

    async findByTemplateTypeAndLanguage(templateType: string, language: string): Promise<ResponseDto<EmailTemplateDto>> {
        const record: EmailTemplateDataType = await this.emailTemplateDBService.findByTemplateTypeAndLanguage(templateType, language);

        if (!record) {

            const response: ResponseDto<EmailTemplateDto> = new ResponseDto<EmailTemplateDto>(404, new EmailTemplateDto());

            return response;
        }

        const response: ResponseDto<EmailTemplateDto> = new ResponseDto<EmailTemplateDto>(200, await this.convertToDto(record));

        return response;

    }

    async deleteById(emailTemplateId: string): Promise<ResponseDto<EmailTemplateDto>> {

        this.logger.log(`Deleting Email Template Record for ${emailTemplateId}`);

        try {
            await this.emailTemplateDBService.deleteById(
                emailTemplateId,
            );

            const response: ResponseDto<EmailTemplateDto> = new ResponseDto<EmailTemplateDto>(204, new EmailTemplateDto());

            return response;
        }
        catch (error) {
            this.logger.error(error);

            throw new BadRequestException('Unable to delete record');
        }


    }

    async convertToDto(record: EmailTemplateDataType): Promise<EmailTemplateDto> {
        const emailTemplateDto: EmailTemplateDto = new EmailTemplateDto();

        emailTemplateDto.emailTemplateId = record.emailTemplateId ?? '';
        emailTemplateDto.emailTemplateType = record.GSI2PK?.split('#')[0] as EmailTemplateType ?? EmailTemplateType.Unknown;
        emailTemplateDto.language = record.GSI2PK?.split('#')[1] ?? '';
        emailTemplateDto.data = new EmailTemplateDataDto();
        emailTemplateDto.data.htmlData = record.data?.htmlData ?? '';
        emailTemplateDto.data.textData = record.data?.textData ?? '';
        emailTemplateDto.subject = record.subject ? record.subject : '';

        return emailTemplateDto;
    }


}


