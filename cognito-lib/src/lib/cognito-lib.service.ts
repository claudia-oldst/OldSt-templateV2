import {
    AdminCreateUserCommand,
    AdminDeleteUserCommand,
    AdminGetUserCommand,
    AdminInitiateAuthCommand,
    AdminRespondToAuthChallengeCommand,
    AdminSetUserPasswordCommand,
    CognitoIdentityProviderClient,
    ConfirmForgotPasswordCommand,
    ConfirmSignUpCommand,
    ForgotPasswordCommand,
    ResendConfirmationCodeCommand,
    SignUpCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { CognitoCompleteNewPasswordDto, CognitoDto, CognitoForgotPasswordDto, CognitoQueueDto, CognitoTokenDto } from '@dto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CognitoLibService {
    private readonly logger = new Logger(CognitoLibService.name);
    private cognitoClient: CognitoIdentityProviderClient;
    constructor(private readonly configService: ConfigService) {
        this.cognitoClient = new CognitoIdentityProviderClient({
            region: this.configService.get<string>('DEFAULT_REGION'),
        });
    }

    async getCognitoUser(email: string) {

        this.logger.log(`Getting Cognito User: ${email}`);

        const input = {
            UserPoolId: this.configService.get<string>(
                'AWS_COGNITO_USER_POOL_ID'
            ),
            Username: email,
        };
        const command = new AdminGetUserCommand(input);
        const response = await this.cognitoClient.send(command);

        this.logger.log(`Cognito User: ${JSON.stringify(response)}`);

        return response;
    }

    async deleteUser(data: CognitoQueueDto) {

        this.logger.log(`Deleting Cognito User: ${data.email}`);

        const input = {
            UserPoolId: this.configService.get<string>(
                'AWS_COGNITO_USER_POOL_ID'
            ),
            Username: data.email,
        };
        const command = new AdminDeleteUserCommand(input);
        const response = await this.cognitoClient.send(command);

        this.logger.log(`Cognito User Deleted: ${JSON.stringify(response)}`);

        return response;
    }

    async loginUser(data: CognitoDto) {


        const input = {
            UserPoolId: this.configService.get<string>(
                'AWS_COGNITO_USER_POOL_ID'
            ),
            ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
            AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
            AuthParameters: {
                USERNAME: data.email,
                PASSWORD: data.password,
            },
        };
        const command = new AdminInitiateAuthCommand(input);
        const response = await this.cognitoClient.send(command);

        return response;
    }

    async triggerForgotPassword(data: CognitoQueueDto) {

        this.logger.log(`Triggering Forgot Password for: ${data.email}`);

        const input = {
            UserPoolId: this.configService.get<string>(
                'AWS_COGNITO_USER_POOL_ID'
            ),
            ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
            Username: data.email,

        };
        const command = new ForgotPasswordCommand(input);
        const response = await this.cognitoClient.send(command);

        this.logger.log(`Forgot Password Triggered: ${JSON.stringify(response)}`);

        return response;

    }

    async confirmPasswordCode(data: CognitoForgotPasswordDto) {

        this.logger.log(`Confirming Password Code for: ${data.email}`);

        const input = {
            UserPoolId: this.configService.get<string>(
                'AWS_COGNITO_USER_POOL_ID'
            ),
            ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
            Username: data.email,
            ConfirmationCode: data.code,
            Password: data.password

        };
        const command = new ConfirmForgotPasswordCommand(input);
        const response = await this.cognitoClient.send(command);

        this.logger.log(`Password Code Confirmed: ${JSON.stringify(response)}`);

        return response;
    }

    async changePassword(data: CognitoDto) {
        const input = {
            UserPoolId: this.configService.get<string>(
                'AWS_COGNITO_USER_POOL_ID'
            ),
            ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
            Username: data.email,
            Password: data.password,
            Permanent: true,


        };
        const command = new AdminSetUserPasswordCommand(input);
        const response = await this.cognitoClient.send(command);

        this.logger.log(`Password Changed: ${JSON.stringify(response)}`);

        return response;
    }

    async signupUser(data: CognitoQueueDto) {


        this.logger.log(`Signing up User: ${data.email}`);

        const input = {
            ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
            Password: data.password,
            Username: data.email,
        };

        const command = new SignUpCommand(input);

        const response = await this.cognitoClient.send(command);

        this.logger.log(`User Signed Up: ${JSON.stringify(response)}`);

        return response;
    }

    async completeNewPassword(data: CognitoCompleteNewPasswordDto) {

        this.logger.log(`Completing New Password for: ${data.email}`);

        const input = {
            ChallengeName: 'NEW_PASSWORD_REQUIRED',
            UserPoolId: this.configService.get<string>('AWS_COGNITO_USER_POOL_ID'),
            ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
            ChallengeResponses: {
                USERNAME: data.email,
                NEW_PASSWORD: data.password,
            },
            Session: data.session
        };

        const command = new AdminRespondToAuthChallengeCommand(input);

        const response = await this.cognitoClient.send(command);

        this.logger.log(`New Password Completed: ${JSON.stringify(response)}`);

        return response;
    }

    async resendConfirmationCode(data: CognitoQueueDto) {

        this.logger.log(`Resending Confirmation Code for: ${data.email}`);

        const input = {
            ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
            Username: data.email,
        };
        const command = new ResendConfirmationCodeCommand(input);

        const response = await this.cognitoClient.send(command);

        this.logger.log(`Confirmation Code Resent: ${JSON.stringify(response)}`);
    }

    async confirmUser(data: CognitoQueueDto) {

        this.logger.log(`Confirming User: ${data.email}`);

        const input = {
            ClientId: this.configService.get<string>('AWS_COGNITO_CLIENT_ID'),
            Username: data.email,
            ConfirmationCode: data.code,
            ForceAliasCreation: false,
        };
        const command = new ConfirmSignUpCommand(input);

        const response = await this.cognitoClient.send(command);

        this.logger.log(`User Confirmed: ${JSON.stringify(response)}`);

        return response;
    }

    async resendInvitation(data: CognitoQueueDto) {

        this.logger.log(`Resending Invitation for: ${data.email}`);

        const input = {
            UserPoolId: this.configService.get<string>(
                'AWS_COGNITO_USER_POOL_ID'
            ),
            Username: data.email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: data.email,
                },
                {
                    Name: 'email_verified',
                    Value: 'true',
                },
            ],
            ForceAliasCreation: false,
            MessageAction: 'RESEND',

            DesiredDeliveryMediums: ['EMAIL'],
        };
        const command = new AdminCreateUserCommand(input);
        const response = await this.cognitoClient.send(command);

        this.logger.log(`Invitation Resent: ${JSON.stringify(response)}`);

        return response;
    }

    async adminCreateUser(data: CognitoQueueDto) {

        this.logger.log(`Admin Creating User: ${data.email}`);

        const input = {
            UserPoolId: this.configService.get<string>(
                'AWS_COGNITO_USER_POOL_ID'
            ),
            Username: data.email,
            UserAttributes: [
                {
                    Name: 'email',
                    Value: data.email,
                },
                {
                    Name: 'email_verified',
                    Value: 'true',
                },
            ],
            ForceAliasCreation: false,

            DesiredDeliveryMediums: ['EMAIL'],
        };
        const command = new AdminCreateUserCommand(input);


        const response = await this.cognitoClient.send(command);

        this.logger.log(`User Created: ${JSON.stringify(response)}`);


        return response;
    }

    // call cognito  /oauth2/token endpoint with grant_type=authorization_code
    async generateToken(code: string) {

        this.logger.log(`Generating Token for: ${code}`);

        const input = {
            grant_type: 'authorization_code',
            client_id: this.configService.get<string>('AWS_COGNITO_CLIENT_ID') || '',
            code: code,
            redirect_uri: this.configService.get<string>(
                'AWS_COGNITO_REDIRECT_URL'
            ) || '',
        };
        const queryString = await this.generateQueryString(input);
        const url = `${this.configService.get<string>(
            'AWS_COGNITO_DOMAIN_URL'
        )}/oauth2/token?${queryString}`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
        });

        return response.json();
    }





    //build query string from CognitoTokenDto
    async generateQueryString(data: CognitoTokenDto) {
        let queryString = '';

        for (const [key, value] of Object.entries(data)) {
            queryString += `${key}=${value}&`;
        }

        return queryString;
    };



}
