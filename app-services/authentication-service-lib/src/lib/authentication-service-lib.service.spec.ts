import { CognitoLibService } from '@cognito-lib';
import { CognitoDto } from '@dto';
import { UserDataType } from '@dynamo-db-lib';
import { UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { SqsSenderLibService } from '@sqs-service-lib';
import { UserDatabaseDynamodbLibService } from '@user-database-dynamodb-lib';
import { AuthenticationServiceLibService } from './authentication-service-lib.service';

describe('AuthenticationServiceLibService', () => {
    let service: AuthenticationServiceLibService;

    const mockConfigService = {
        get: jest.fn().mockImplementation((key: string) => {
            switch (key) {
                case 'AWS_AUTHENTICATION_QUEUE_URL':
                    return 'auth-url';
                case 'DEFAULT_REGION':
                    return 'region';

                default:
                    return null;
            }
        }),

    };

    const mockSqsSenderLibService = {
        sendMessage: jest.fn().mockImplementation(() => {
            return Promise.resolve({});
        }),


    };

    const mockCogntitoLibService = {
        loginUser: jest.fn().mockImplementation((data: CognitoDto) => {
            if (data.email == 'email@old.st') {
                return Promise.resolve(new CognitoDto());
            } else {
                return Promise.reject(new UnauthorizedException('Invalid Credentials'));

            }
        }),

        generateToken: jest.fn().mockImplementation(() => {
            return Promise.resolve({});
        }),

        completeNewPassword: jest.fn().mockImplementation(() => {
            return Promise.resolve({});
        }),

        changePassword: jest.fn().mockImplementation(() => {
            return Promise.resolve({});
        }),

        confirmPasswordCode: jest.fn().mockImplementation(() => {
            return Promise.resolve({});
        }),

    };

    const mockUserDatabaseDynamodbLibService = {
        findByEmail: jest.fn().mockImplementation((email: string) => {


            if (email === 'email@old.st' || email === 'db_error@old.st') {
                const response: UserDataType = {
                    userId: '1234567890',
                    email: 'email@old.st',
                    firstName: 'firstname',
                    lastName: 'LastName',
                    userRole: 'USER',
                };

                return response;
            } else {
                return Promise.resolve(null);
            }
        }),
    };




    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [AuthenticationServiceLibService, ConfigService, SqsSenderLibService, CognitoLibService, UserDatabaseDynamodbLibService],
        })
            .overrideProvider(ConfigService)
            .useValue(mockConfigService)
            .overrideProvider(SqsSenderLibService)
            .useValue(mockSqsSenderLibService)
            .overrideProvider(CognitoLibService)
            .useValue(mockCogntitoLibService)
            .overrideProvider(UserDatabaseDynamodbLibService)
            .useValue(mockUserDatabaseDynamodbLibService)
            .compile();

        service = module.get(AuthenticationServiceLibService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });


    //happy path test
    it('login should be successful', async () => {
        const data: CognitoDto = new CognitoDto();

        data.email = 'email@old.st';
        data.password = 'password';

        await service.login(data);

        expect(mockUserDatabaseDynamodbLibService.findByEmail).toBeCalledTimes(1);
        expect(mockCogntitoLibService.loginUser).toBeCalledTimes(1);
    });

    //login email does not exist
    it('login should throw error', async () => {
        const data: CognitoDto = new CognitoDto();

        data.email = 'error@old.st';
        data.password = 'password';

        await expect(service.login(data)).rejects.toThrowError(UnauthorizedException);
    });

    //login invalid credentials
    it('login should throw unauthorized error ', async () => {
        const data: CognitoDto = new CognitoDto();

        data.email = 'db_error@old.st';
        data.password = 'password';

        await expect(service.login(data)).rejects.toThrowError(UnauthorizedException);
    });


    //gerate token happy path , generateToken calls cognitoService.generateToken
    it('generateToken should be successful', async () => {
        const code = 'code';

        await service.generateToken(code);

        expect(mockCogntitoLibService.generateToken).toBeCalledTimes(1);
    });

    //createAdminCognitoUser happy path , createAdminCognitoUser calls sqsSenderLibService.sendMessage
    it('createAdminCognitoUser should be successful', async () => {
        const data = {
            email: 'email@old.st'
        };

        await service.createAdminCognitoUser(data);

        expect(mockSqsSenderLibService.sendMessage).toBeCalledTimes(1);

        expect(mockConfigService.get).toBeCalledTimes(1);
    });


    //completeNewPassword happy path , completeNewPassword calls cognitoService.completeNewPassword
    it('completeNewPassword should be successful', async () => {
        const data = {
            email: 'email@old.st',
            password: 'password',
            session: 'session'
        };

        await service.completeNewPassword(data);

        expect(mockCogntitoLibService.completeNewPassword).toBeCalledTimes(1);
    });

    //resendInvitation happy path , resendInvitation calls sqsSenderLibService.sendMessage
    it('resendInvitation should be successful', async () => {
        const data = {
            email: 'email@old.st'
        };

        await service.resendInvitation(data);

        expect(mockSqsSenderLibService.sendMessage).toBeCalledTimes(1);

        expect(mockConfigService.get).toBeCalledTimes(1);
    });


    //signUp happy path , signUp calls sqsSenderLibService.sendMessage
    it('signUp should be successful', async () => {
        const data = {
            email: 'email@old.st',
            password: 'password'
        };

        await service.signUp(data);

        expect(mockSqsSenderLibService.sendMessage).toBeCalledTimes(1);

        expect(mockConfigService.get).toBeCalledTimes(1);
    });

    //confirmSignUp happy path , confirmSignUp calls cognitoService.confirmSignUp
    it('confirmSignUp should be successful', async () => {
        const data = {
            email: 'email@old.st',
            code: 'code'
        };

        await service.confirmSignUp(data);
        expect(mockSqsSenderLibService.sendMessage).toBeCalledTimes(1);

        expect(mockConfigService.get).toBeCalledTimes(1);
    });


    //resendConfirmationCode happy path , resendConfirmationCode calls sqsSenderLibService.sendMessage
    it('resendConfirmationCode should be successful', async () => {
        const data = {
            email: 'email@old.st'
        };

        await service.resendConfirmationCode(data);

        expect(mockSqsSenderLibService.sendMessage).toBeCalledTimes(1);

        expect(mockConfigService.get).toBeCalledTimes(1);
    });

    //deleteUser happy path , deleteUser calls sqsSenderLibService.sendMessage and configService.get

    it('deleteUser should be successful', async () => {
        const data = {
            email: 'email@old.st'
        };

        await service.deleteUser(data);

        expect(mockSqsSenderLibService.sendMessage).toBeCalledTimes(1);

        expect(mockConfigService.get).toBeCalledTimes(1);
    });

    //changePassword happy path , changePassword calls cognitoService.changePassword
    it('changePassword should be successful', async () => {
        const data = {
            email: 'email@olst.st',
            password: 'password'
        };

        await service.changePassword(data);

        expect(mockCogntitoLibService.changePassword).toBeCalledTimes(1);
    });

    //confirmPasswordChange happy path , confirmPasswordChange calls cognitoService.confirmPasswordChange

    it('confirmPasswordChange should be successful', async () => {
        const data = {
            email: 'email@old.st',
            code: 'code',
            password: 'password'
        };

        await service.confirmPasswordChange(data);

        expect(mockCogntitoLibService.confirmPasswordCode).toBeCalledTimes(1);
    });


    //forgotPassword happy path , forgotPassword calls findUserByEmail and sqsSenderLibService.sendMessage
    it('forgotPassword should be successful', async () => {
        const data = {
            email: 'email@old.st'
        };

        await service.forgotPassword(data);

        expect(mockSqsSenderLibService.sendMessage).toBeCalledTimes(1);

        expect(mockConfigService.get).toBeCalledTimes(1);

        expect(mockUserDatabaseDynamodbLibService.findByEmail).toBeCalledTimes(1);
    });


    //forgotPassword user does not exist , forgotPassword calls findUserByEmail and sqsSenderLibService.sendMessage
    it('forgotPassword should throw error', async () => {
        const data = {
            email: 'error@old.st'
        };

        await expect(service.forgotPassword(data)).rejects.toThrowError(UnauthorizedException);
    });

});
