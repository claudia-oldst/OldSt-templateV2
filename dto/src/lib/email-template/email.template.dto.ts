import { ApiProperty } from '@nestjs/swagger';
import { EmailTemplateType } from '../enum/email.template.type.enum';
import { EmailTemplateDataDto } from './email.template.data.dto';

export class EmailTemplateDto {

    @ApiProperty()
    language!: string;

    @ApiProperty({
        enum: EmailTemplateType,
    })
    emailTemplateType!: EmailTemplateType;


    @ApiProperty()
    emailTemplateId!: string;

    @ApiProperty(
        {
            type: EmailTemplateDataDto,
        }
    )
    data!: EmailTemplateDataDto;

    @ApiProperty()
    subject!: string;
}
