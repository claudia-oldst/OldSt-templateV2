import { CreateUserDto, PageDto } from '@dto';
import { UserDataType } from '@dynamo-db-lib';
import { MessageQueueAwsSqsService } from '@message-queue-lib';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UserDatabaseDynamodbLibService } from '@user-database-dynamodb-lib';
import { UserServiceDynamoLibService } from './user-service-dynamo-lib.service';


describe('UserServiceDynamoLibService', () => {
    let service: UserServiceDynamoLibService;

    const mockUserDatabaseLibService = {
        createRecord: jest.fn().mockImplementation((data: CreateUserDto) => {

            if (data.email === 'error@old.st') {
                return Promise.reject(new BadRequestException('Unable to create record'));

            } else {
                const response: UserDataType = {
                    userId: '1234567890',
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    userRole: data.userRole,
                };

                return response;

            }
        }),
        findByEmail: jest.fn().mockImplementation((email: string) => {

            if (email === 'email@old.st') {
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
        findByEmailAndRole: jest.fn().mockImplementation((email: string, role: string) => {

            if (email === 'email@old.st' && role === 'USER') {
                const response: UserDataType = {
                    userId: '1234567890',
                    email: 'email@old.st',
                    firstName: 'firstname',
                    lastName: 'LastName',
                    userRole: 'USER',
                };

                return [response];
            } else {
                return Promise.resolve([]);
            }
        }),
        findById: jest.fn().mockImplementation((userId: string) => {

            if (userId === '1234567890' || userId === '1111') {
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
        deleteRecordById: jest.fn().mockImplementation((userId: string) => {

            if (userId === '1234567890') {
                return Promise.resolve(null);
            } else {
                return Promise.reject(new BadRequestException('Unable to delete record'));
            }
        }),
        findRecordsByEmailWithNamesContaining: jest.fn().mockImplementation((email: string, keywords: string) => {

            if (email === 'email@old.st' && keywords === 'FirstName') {
                const response: UserDataType = {
                    userId: '1234567890',
                    email: 'email@old.st',
                    firstName: 'Firstname',
                    lastName: 'LastName',
                    userRole: 'USER',
                };

                return [response];
            } else {
                return Promise.resolve([]);
            }
        }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        findRecordswithPaging: jest.fn().mockImplementation((userRole: string, limit: number, direction: string, cursorPointer: string) => {

            if (userRole === 'USER') {
                const response: UserDataType = {
                    userId: '1234567890',
                    email: 'email@old.st',
                    firstName: 'Firstname',
                    lastName: 'LastName',
                    userRole: 'USER',
                };
                const dataList: UserDataType[] = [response];

                return new PageDto(dataList, 'next', 'prev');
            } else {
                return new PageDto([], 'next', 'prev');
            }
        }),

    };

    const mockSqsSenderLibService = {
        sendMessage: jest.fn().mockImplementation(() => {
            return Promise.resolve({});
        }),


    };

    const mockConfigService = {
        get: jest.fn().mockImplementation((key: string) => {
            switch (key) {
                case 'AWS_LOGGING_QUEUE_URL':
                    return 'sqs-url';
                default:
                    return null;
            }
        }),

    };



    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [UserServiceDynamoLibService, UserDatabaseDynamodbLibService, MessageQueueAwsSqsService, ConfigService],
        })
            .overrideProvider(UserDatabaseDynamodbLibService)
            .useValue(mockUserDatabaseLibService)
            .overrideProvider(MessageQueueAwsSqsService)
            .useValue(mockSqsSenderLibService)
            .overrideProvider(ConfigService)
            .useValue(mockConfigService)
            .compile();

        service = module.get(UserServiceDynamoLibService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });

    //happy path test
    it('it shoud create a user record', async () => {
        const userData: CreateUserDto = new CreateUserDto();

        userData.email = 'old@old.st';
        userData.firstName = 'Firstname';
        userData.lastName = 'Lastname';
        userData.userRole = 'USER';

        const response = await service.createUserRecord(userData);

        expect(response.statusCode).toEqual(201);
        expect(mockSqsSenderLibService.sendMessage).toBeCalledTimes(1);
        expect(mockConfigService.get).toBeCalledTimes(1);
    });

    //db throwing error
    it('it shoud throw error when db throws error', async () => {
        const userData: CreateUserDto = new CreateUserDto();

        userData.email = 'error@old.st';
        userData.firstName = 'Firstname';
        userData.lastName = 'Lastname';
        userData.userRole = 'USER';
        await expect(service.createUserRecord(userData))
            .rejects.toThrow(new BadRequestException('Unable to create record'));

    });

    //duplicate email test
    it('it shoud throw error when email already exists', async () => {
        const userData: CreateUserDto = new CreateUserDto();

        userData.email = 'email@old.st';
        userData.firstName = 'Firstname';
        userData.lastName = 'Lastname';
        userData.userRole = 'USER';
        await expect(service.createUserRecord(userData))
            .rejects.toThrow(new BadRequestException(`User already exists with email: ${userData.email}`));
    });

    //find by email test happy path
    it('it shoud find a record by email', async () => {
        const result = await service.findByEmail('email@old.st');

        expect(result.statusCode).toEqual(200);
    });

    //find by email test not found
    it('it shoud NOT find a record by email', async () => {
        const result = await service.findByEmail('error@old.st');

        expect(result.statusCode).toEqual(404);
    });

    //find by email and role test happy path
    it('it shoud find a record by email and role', async () => {
        const result = await service.findByEmailByRole('email@old.st', 'USER');

        expect(result.statusCode).toEqual(200);
    });

    //find by email and role test not found
    it('it shoud NOT find a record by email and role', async () => {
        const result = await service.findByEmailByRole('error@old.st', 'USER');

        expect(result.statusCode).toEqual(404);
    });

    //find by id test happy path
    it('it shoud find a record by id', async () => {
        const result = await service.findById('1234567890');

        expect(result.statusCode).toEqual(200);
    });

    //find by id test not found
    it('it shoud NOT find a record by id', async () => {
        await expect(service.findById('0987654321'))
            .rejects.toThrow(new NotFoundException('User Id Not Found'));
    });

    //delete by id test happy path
    it('it shoud delete a record by id', async () => {
        const result = await service.deleteById('1234567890');

        expect(result.statusCode).toEqual(204);
    });

    //delete by id test not found
    it('record Id not valid', async () => {
        await expect(service.deleteById('0987654321'))
            .rejects.toThrow(new BadRequestException('User Id Not Found'));
    });

    //delete by id db throw error
    it('it shoud throw error when db throws error', async () => {
        await expect(service.deleteById('1111'))
            .rejects.toThrow(new BadRequestException('Unable to delete record'));
    });

    //find by email with name containing test happy path
    it('it shoud find a record by email with name containing', async () => {
        const result = await service.findRecordsByEmailWithNamesContaining('email@old.st', 'FirstName');

        expect(result.body.length).toEqual(1);
        expect(result.statusCode).toEqual(200);
    });

    //find by email with name containing test happy path
    it('it shoud NOT  find any record by email with name containing', async () => {
        const result = await service.findRecordsByEmailWithNamesContaining('error@old.st', 'FirstName');

        expect(result.body.length).toEqual(0);
        expect(result.statusCode).toEqual(200);
    });

    //find by user role with paging test happy path
    it('it shoud find a record by user role with paging', async () => {
        const result = await service.findRecordswithPaging('USER', 10, 'next', '1234567890');

        expect(result.body.data.length).toEqual(1);
        expect(result.statusCode).toEqual(200);
    });

    //find by user role with paging test no records found
    it('it shoud NOT find a record by user role with paging', async () => {
        const result = await service.findRecordswithPaging('ADMIN', 10, 'next', '1234567890');

        expect(result.body.data.length).toEqual(0);
        expect(result.statusCode).toEqual(200);
    });
});
