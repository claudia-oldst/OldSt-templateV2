import { CognitoLibService } from '@cognito-lib';
import { AuthenticationAction, CognitoCompleteNewPasswordDto, CognitoConfirmCodeDto, CognitoDto, CognitoEmailDto, CognitoForgotPasswordDto, CognitoQueueDto } from '@dto';
import { MessageQueueService } from '@message-queue-lib';
import { Inject, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDatabaseDynamodbLibService } from '@user-database-dynamodb-lib';

@Injectable()
export class AuthenticationServiceLibService {
    private readonly logger = new Logger(AuthenticationServiceLibService.name);
    constructor(
        private readonly configService: ConfigService,
        @Inject('MessageQueueAwsSqsService')
        private readonly messageQueueService: MessageQueueService,
        private readonly cognitoService: CognitoLibService,
        private readonly userService: UserDatabaseDynamodbLibService
    ) {
    }

    async login(data: CognitoDto) {

        const userRecord = await this.userService.findByEmail(data.email);


        if (!userRecord || !userRecord == null) {
            throw new UnauthorizedException('Email Does Not Exist');
        }

        try {
            return await this.cognitoService.loginUser(data);
        } catch (error) {
            throw new UnauthorizedException('Invalid Credentials');
        }
    }


    async generateToken(code: string) {
        return await this.cognitoService.generateToken(code);
    }

    async createAdminCognitoUser(data: CognitoEmailDto) {
        const authenticationSQSURL = this.configService.get<string>(
            'AWS_AUTHENTICATION_QUEUE_URL'
        );

        const sqsData: CognitoQueueDto = new CognitoQueueDto();

        sqsData.action = AuthenticationAction.AdminCreateUser;
        sqsData.email = data.email;
        await this.messageQueueService.sendMessage(
            authenticationSQSURL ?? '',
            JSON.stringify(sqsData)
        );
    }

    async completeNewPassword(data: CognitoCompleteNewPasswordDto) {
        // TODO: add feature to be able to handle other user details, if there are any
        return await this.cognitoService.completeNewPassword(data);
    }

    async resendInvitation(data: CognitoEmailDto) {
        const authenticationSQSURL = this.configService.get<string>(
            'AWS_AUTHENTICATION_QUEUE_URL'
        );

        const sqsData: CognitoQueueDto = new CognitoQueueDto();

        sqsData.action = AuthenticationAction.ResendInvitation;
        sqsData.email = data.email;
        await this.messageQueueService.sendMessage(
            authenticationSQSURL ?? '',
            JSON.stringify(sqsData)
        );
    }

    async signUp(data: CognitoDto) {
        const authenticationSQSURL = this.configService.get<string>(
            'AWS_AUTHENTICATION_QUEUE_URL'
        );

        const sqsData: CognitoQueueDto = new CognitoQueueDto();

        sqsData.action = AuthenticationAction.SignUp;
        sqsData.email = data.email;
        sqsData.password = data.password;
        await this.messageQueueService.sendMessage(
            authenticationSQSURL ?? '',
            JSON.stringify(sqsData)
        );

    }

    async confirmSignUp(data: CognitoConfirmCodeDto) {
        const authenticationSQSURL = this.configService.get<string>(
            'AWS_AUTHENTICATION_QUEUE_URL'
        );

        const sqsData: CognitoQueueDto = new CognitoQueueDto();

        sqsData.action = AuthenticationAction.CodeVerification;
        sqsData.email = data.email;
        sqsData.code = data.code;
        await this.messageQueueService.sendMessage(
            authenticationSQSURL ?? '',
            JSON.stringify(sqsData)
        );
    }

    async resendConfirmationCode(data: CognitoEmailDto) {
        const authenticationSQSURL = this.configService.get<string>(
            'AWS_AUTHENTICATION_QUEUE_URL'
        );

        const sqsData: CognitoQueueDto = new CognitoQueueDto();

        sqsData.action = AuthenticationAction.ResendConfirmationCode;
        sqsData.email = data.email;
        await this.messageQueueService.sendMessage(
            authenticationSQSURL ?? '',
            JSON.stringify(sqsData)
        );
    }

    async deleteUser(data: CognitoEmailDto) {
        const authenticationSQSURL = this.configService.get<string>(
            'AWS_AUTHENTICATION_QUEUE_URL'
        );

        const sqsData: CognitoQueueDto = new CognitoQueueDto();

        sqsData.action = AuthenticationAction.Delete;
        sqsData.email = data.email;
        await this.messageQueueService.sendMessage(
            authenticationSQSURL ?? '',
            JSON.stringify(sqsData)
        );
    }

    async changePassword(data: CognitoDto) {
        return await this.cognitoService.changePassword(data);
    }

    async confirmPasswordChange(data: CognitoForgotPasswordDto) {
        return await this.cognitoService.confirmPasswordCode(data);
    }

    async forgotPassword(data: CognitoEmailDto) {

        const userRecord = await this.userService.findByEmail(data.email);

        if (!userRecord || !userRecord == null) {
            throw new UnauthorizedException('Email Does Not Exist');
        }


        const authenticationSQSURL = this.configService.get<string>(
            'AWS_AUTHENTICATION_QUEUE_URL'
        );

        const sqsData: CognitoQueueDto = new CognitoQueueDto();

        sqsData.action = AuthenticationAction.ForgotPassword;
        sqsData.email = data.email;
        await this.messageQueueService.sendMessage(
            authenticationSQSURL ?? '',
            JSON.stringify(sqsData)
        );
    }


}
