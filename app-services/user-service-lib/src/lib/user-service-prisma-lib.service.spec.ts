import { CreateUserDto } from '@dto';
import { MessageQueueAwsSqsService } from '@message-queue-lib';
import { BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { UserDatabasePrismaLibService } from '@user-database-prisma-lib';
import { UserServicePrismaLibService } from './user-service-primsa-lib.service';

describe('UserServicePrismaLibService', () => {
    let service: UserServicePrismaLibService;

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

    const mockSqsSenderLibService = {
        sendMessage: jest.fn().mockImplementation(() => {
            return Promise.resolve({});
        }),


    };


    const mockUserDatabasePrismaLibService = {
        createRecord: jest.fn().mockImplementation((data: CreateUserDto) => {
            if (data.email === 'error@old.st') {
                return Promise.reject(new BadRequestException('Unable to create record'));

            } else {
                return {
                    id: 'id',
                    email: data.email,
                    fullName: data.firstName + ' ' + data.lastName,
                    country: data.data.country,
                };


            }
        }),
        getByEmail: jest.fn().mockImplementation((email: string) => {

            if (email === 'email@old.st') {
                return {
                    id: 'id',
                    email: email,
                    fullName: 'fullName',
                    country: 'country',
                };

            } else {
                return null;
            }

        }),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                UserServicePrismaLibService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: MessageQueueAwsSqsService, useValue: mockSqsSenderLibService },
                { provide: UserDatabasePrismaLibService, useValue: mockUserDatabasePrismaLibService },
            ],
        })

            .compile();

        service = module.get(UserServicePrismaLibService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });

    //createUserRecord happy path , user does not exist , should return 201 , sqssender should be called  ,config service should be called  
    it('createUserRecord happy path , user does not exist , should return 201 , sqssender should be called  ,config service should be called  ', async () => {
        const data: CreateUserDto = {
            email: 'old@old.st',
            firstName: 'firstName',
            lastName: 'lastName',
            userRole: 'USER',
            data: {
                country: 'country',
            },
        };

        const result = await service.createUserRecord(data);

        expect(result.statusCode).toEqual(201);
        expect(result.body.email).toEqual(data.email);
        expect(mockSqsSenderLibService.sendMessage).toHaveBeenCalledTimes(1);
        expect(mockConfigService.get).toHaveBeenCalledTimes(1);
    });

    //createUserRecord , user already exists , should throw bad request exception , sqssender should not be called  ,config service should not be called
    it('createUserRecord , user already exists , should throw bad request exception , sqssender should not be called  ,config service should not be called', async () => {
        const data: CreateUserDto = {
            email: 'email@old.st',
            firstName: 'firstName',
            lastName: 'lastName',
            userRole: 'USER',
            data: {
                country: 'country',
            },
        };

        await expect(service.createUserRecord(data))
            .rejects.toThrow(new BadRequestException(`User already exists with email: ${data.email}`));
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

    //findByEmail happy path , user exists , should return 200
    it('findByEmail happy path , user exists , should return 200', async () => {
        const email = 'email@old.st';
        const result = await service.findByEmail(email);

        expect(result.statusCode).toEqual(200);
        expect(result.body.email).toEqual(email);
    });

    //findByEmail , user does not exist , should return 404
    it('findByEmail , user does not exist , should return 404', async () => {
        const email = 'notfound@old.st';
        const result = await service.findByEmail(email);

        expect(result.statusCode).toEqual(404);
    });
});
