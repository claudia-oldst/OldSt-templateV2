import { CognitoLibService } from '@cognito-lib';
import { AuthenticationAction, CognitoQueueDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
    private readonly logger = new Logger(AppService.name);
    constructor(private readonly cognitoService: CognitoLibService) { }
    getData(): { message: string } {
        return { message: 'Welcome to authentication-service!' };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleMessage(records: any) {
        this.logger.log(`Record Value: ${JSON.stringify(records)}`);

        for (const record of records) {
            this.logger.log(`Processing SQS Message: ${JSON.stringify(record)}`);

            const data: CognitoQueueDto = JSON.parse(record.body);

            this.logger.log(`Cognito Data: ${JSON.stringify(data)}`);

            try {
                switch (data.action) {
                    case AuthenticationAction.AdminCreateUser:
                        await this.adminCreateUser(data);
                        break;
                    case AuthenticationAction.SignUp:
                        await this.signUp(data);
                        break;
                    case AuthenticationAction.CodeVerification:
                        await this.codeVerification(data);
                        break;
                    case AuthenticationAction.ResendConfirmationCode:
                        await this.resendConfirmationCode(data);
                        break;
                    case AuthenticationAction.ResendInvitation:
                        await this.resendInvitation(data);
                        break;
                    case AuthenticationAction.Delete:
                        await this.deleteUser(data);
                        break;
                    case AuthenticationAction.ForgotPassword:
                        await this.forgotPassword(data);
                }
            } catch (err) {
                this.logger.error(err);
            }
        }
    }

    async adminCreateUser(data: CognitoQueueDto) {
        const response = await this.cognitoService.adminCreateUser(data);

        this.logger.log(response);
    }

    async signUp(data: CognitoQueueDto) {
        const response = await this.cognitoService.signupUser(data);

        this.logger.log(response);

    }

    async resendConfirmationCode(data: CognitoQueueDto) {
        const response = await this.cognitoService.resendConfirmationCode(data);

        this.logger.log(response);

    }

    async codeVerification(data: CognitoQueueDto) {
        const response = await this.cognitoService.confirmUser(data);

        this.logger.log(response);
    }

    async resendInvitation(data: CognitoQueueDto) {
        const response = await this.cognitoService.resendInvitation(data);

        this.logger.log(response);
    }

    async deleteUser(data: CognitoQueueDto) {
        const response = await this.cognitoService.deleteUser(data);

        this.logger.log(response);
    }

    async forgotPassword(data: CognitoQueueDto) {
        const response = await this.cognitoService.triggerForgotPassword(data);

        this.logger.log(response);
    }
}
