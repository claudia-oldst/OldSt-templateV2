import { AwsSesLibService } from '@aws-ses-lib';
import { EmailDto, EmailNotificationDto, ResponseDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';
import { EmailServiceLib } from './email-service.abstract.class';

@Injectable()
export class EmailAWSSesService implements EmailServiceLib {
    private readonly logger = new Logger(EmailAWSSesService.name);
    constructor(
        private readonly awsSesLibService: AwsSesLibService,
    ) {
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async sendEmailToUser(data: EmailDto, fromEmail: string, files: any[]): Promise<ResponseDto<string>> {
        try {


            this.logger.log(`Sending Email to ${data.email} from ${fromEmail} with subject ${data.subject} and body ${data.body}`);

            const emailNotificationDto = new EmailNotificationDto();

            //email address needs to be verified in aws ses if the ses is in sandbox mode
            emailNotificationDto.toAddress = data.email;
            emailNotificationDto.source = fromEmail;

            emailNotificationDto.replyToAddress = data.email;
            emailNotificationDto.subjectData = data.subject;
            emailNotificationDto.messageBodyHtmlData = data.body;
            emailNotificationDto.messageBodyTextData = data.body;
            emailNotificationDto.files = files;


            await this.awsSesLibService.sendEmail(emailNotificationDto);

            const response: ResponseDto<string> = new ResponseDto<string>(200, 'Email Sent Successfully');

            return response;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            this.logger.error(error);

            return new ResponseDto<string>(400, error.message);

        }
    }
}
