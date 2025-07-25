import { SESClient, SendRawEmailCommand } from '@aws-sdk/client-ses';
import { EmailNotificationDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';


@Injectable()
export class AwsSesLibService {

    private readonly logger = new Logger(AwsSesLibService.name);

    private transporter: nodemailer.Transporter;

    constructor(private readonly configService: ConfigService) {

        const sesClient = new SESClient({ region: this.configService.get<string>('DEFAULT_REGION') });

        this.transporter = nodemailer.createTransport({
            SES: {
                ses: sesClient,
                aws: { SendRawEmailCommand }
            },
        });

    }

    async sendEmail(data: EmailNotificationDto) {

        this.logger.log(`Sending Email to ${data.toAddress} from ${data.source} with subject ${data.subjectData} `);

        const attachments = data.files?.map(file => ({
            filename: file.originalname,
            content: file.buffer,
        }));

        const mailOptions: nodemailer.SendMailOptions = {
            from: data.source,
            to: data.toAddress,
            subject: data.subjectData,
            text: data.messageBodyTextData,
            html: data.messageBodyHtmlData,
            attachments: attachments
        };

        try {
            const result = await this.transporter.sendMail(mailOptions);

            this.logger.log('Email Sent Successfully JSON.stringify(result)');

            return result;
        } catch (error) {
            this.logger.error(error);
            throw error;
        }

    }
}
