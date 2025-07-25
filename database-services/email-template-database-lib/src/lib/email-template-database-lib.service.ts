import { EmailTemplateDto } from '@dto';
import { DynamoDbService, EmailTemplateDataType } from '@dynamo-db-lib';
import { BadRequestException, Injectable } from '@nestjs/common';

@Injectable()
export class EmailTemplateDatabaseLibService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private emailTemplateTable: any = null;

    constructor(private readonly dynamoDbService: DynamoDbService) {
        this.emailTemplateTable = this.dynamoDbService
            .dynamoDbMainTable()
            .getModel('EmailTemplate');
    }


    async createRecord(data: EmailTemplateDto): Promise<EmailTemplateDataType> {
        const existingRecord: EmailTemplateDataType = await this.findByTemplateTypeAndLanguage(
            data.emailTemplateType, data.language
        );

        if (existingRecord) {
            await this.deleteById(existingRecord.emailTemplateId!);
        }

        const emailTemplate: EmailTemplateDataType = {
            GSI2PK: data.emailTemplateType + '#' + data.language, // 
            data: data.data,
            subject: data.subject,
        };

        return await this.emailTemplateTable.create(emailTemplate);

    }

    async findByTemplateTypeAndLanguage(templateType: string, language: string): Promise<EmailTemplateDataType> {
        const record: EmailTemplateDataType = await this.emailTemplateTable.get(
            {
                GSI2PK: templateType + '#' + language,
            },
            {
                index: 'GSI2',
                follow: true,
            }
        ) as EmailTemplateDataType;

        return record;
    }

    async deleteById(emailTemplateId: string) {

        try {
            await this.emailTemplateTable.remove({
                emailTemplateId: emailTemplateId,
            });


        }
        catch (error) {
            throw new BadRequestException('Unable to delete record');
        }


    }
}
