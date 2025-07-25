import { EmailTemplateDto, EmailTemplateType, ResponseDto } from '@dto';
import { EmailTemplateServiceLibService } from '@email-template-service-lib';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);
    constructor(
        private readonly emailTemplateService: EmailTemplateServiceLibService,
        private readonly configService: ConfigService
    ) { }

    async handleEvent(event) {
        const email = await this.getEmailFromEvent(event);

        switch (event.triggerSource) {
            case 'CustomMessage_SignUp':
            case 'CustomMessage_ResendCode':
                await this.handleSignUp(event, email);
                break;
            case 'CustomMessage_ForgotPassword':
                await this.handleForgotPassword(event, email);
                break;
            case 'CustomMessage_AdminCreateUser':
            case 'CustomMessage_ResendInvitation':
                await this.handleInviteUser(event, email);
                break;
            default:
                this.logger.log(
                    `No custom message is configured for triggerSource ${event.triggerSource}`
                );
        }

        return event;
    }

    async handleSignUp(event, email: string) {
        const emailRecord: ResponseDto<EmailTemplateDto> = await this.emailTemplateService.findByTemplateTypeAndLanguage(
            EmailTemplateType.SignUp,
            'ENGLISH'
        );

        if (emailRecord == null || emailRecord.statusCode !== 200) {
            this.logger.log(
                `No email template is configured for template type ${EmailTemplateType.SignUp}`
            );

            return event;
        }

        //todo fetch user record based on email
        this.logger.log(`Fetching User Record by Email ${email}`);

        //fetch frontend url from config

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        //todo replace frontend url on email template data

        //todo replace all necessary fields
        event.response.emailSubject = emailRecord.body.subject;
        event.response.emailMessage = emailRecord.body.data.htmlData;

        return event;
    }

    async handleForgotPassword(event, email: string) {
        const emailRecord = await this.emailTemplateService.findByTemplateTypeAndLanguage(
            EmailTemplateType.ForgotPassword,
            'ENGLISH'

        );

        if (emailRecord == null || emailRecord.statusCode !== 200) {
            this.logger.log(
                `No email template is configured for template type ${EmailTemplateType.ForgotPassword}`
            );

            return event;
        }

        //todo fetch user record based on email
        this.logger.log(`Fetching User Record by Email ${email}`);

        //fetch frontend url from config

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        //todo replace frontend url on email template data

        //todo replace all necessary fields
        event.response.emailSubject = emailRecord.body.subject;
        event.response.emailMessage = emailRecord.body.data.htmlData;

        return event;
    }

    async handleInviteUser(event, email: string) {
        const emailRecord = await this.emailTemplateService.findByTemplateTypeAndLanguage(
            EmailTemplateType.Invitation,
            'ENGLISH'

        );

        if (emailRecord == null || emailRecord.statusCode !== 200) {
            this.logger.log(
                `No email template is configured for template type ${EmailTemplateType.Invitation}`
            );

            return event;
        }


        //todo fetch user record based on email

        this.logger.log(`Fetching User Record by Email ${email}`);

        //fetch frontend url from config

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const frontendUrl = this.configService.get<string>('FRONTEND_URL');
        //todo replace frontend url on email template data

        //todo replace all necessary fields
        event.response.emailSubject = emailRecord.body.subject;
        event.response.emailMessage = emailRecord.body.data.htmlData;

        return event;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async getEmailFromEvent(event: any) {
        return event.request.userAttributes.email;
    }
}
