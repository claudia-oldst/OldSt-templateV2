import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsSqsLibService {
    private awsSQSConfig: SQSClient;
    private readonly logger = new Logger(AwsSqsLibService.name);
    constructor(private readonly configService: ConfigService) {
        this.awsSQSConfig = new SQSClient({
            region: this.configService.get<string>('DEFAULT_REGION'),
        });
    }

    async sendMessage(queueUrl: string, data: string) {

        const input = {
            QueueUrl: queueUrl,
            MessageBody: data,
        };
        const command = new SendMessageCommand(input);

        try {
            const response = await this.awsSQSConfig.send(command);

            this.logger.log(`Message sent to queue ${queueUrl}`);
            this.logger.log(response);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            this.logger.log(`Error sending message to queue ${queueUrl}`);
            this.logger.error(error);

            throw error;
        }


    }

}
