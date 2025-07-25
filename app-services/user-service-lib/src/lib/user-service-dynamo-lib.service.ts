import { CreateUserDto, LogsDto, PageDto, ResponseDto, UserRole, UsersDto } from '@dto';
import { UserDataType } from '@dynamo-db-lib';
import { MessageQueueAwsSqsService } from '@message-queue-lib';
import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDatabaseDynamodbLibService } from '@user-database-dynamodb-lib';
import { UserServiceLib } from './user-service.abstract.class';

@Injectable()
export class UserServiceDynamoLibService implements UserServiceLib {

    private readonly logger = new Logger(UserServiceDynamoLibService.name);

    constructor(
        private readonly userDBService: UserDatabaseDynamodbLibService,
        private readonly messageSender: MessageQueueAwsSqsService,
        private readonly configService: ConfigService) {

    }

    async createUserRecord(userData: CreateUserDto): Promise<ResponseDto<UsersDto>> {

        this.logger.log(`Creating User Record for ${userData.email} `);

        const existingUser: ResponseDto<UsersDto> = await this.findByEmail(userData.email);

        if (existingUser.statusCode === 200) {
            throw new BadRequestException(`User already exists with email: ${existingUser.body.email}`);
        }



        try {
            const userRecord: UserDataType = await this.userDBService.createRecord(userData);
            const dto: UsersDto = await this.convertToDto(userRecord);


            //sending log data via sqs 
            const logData: LogsDto = new LogsDto();

            const loggingSQSURL = this.configService.get<string>(
                'AWS_LOGGING_QUEUE_URL'
            );


            logData.action = 'CREATE';
            logData.data = JSON.stringify(userData);
            logData.entityName = 'User';
            logData.referenceId = userRecord.userId ? userRecord.userId : '';

            //if the api is called by system assign SYSTEM to user or else assign the user email
            logData.user = 'SYSTEM';

            await this.messageSender.sendMessage(
                loggingSQSURL ?? '',
                JSON.stringify(logData)
            );

            const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(201, dto);

            return response;
        } catch (error) {
            this.logger.error(error);

            throw new BadRequestException('Unable to create record');
        }

    }



    async findByEmail(email: string): Promise<ResponseDto<UsersDto>> {

        this.logger.log(`Fetching User Record by Email ${email}`);

        const userRecord: UserDataType = await this.userDBService.findByEmail(email);

        if (!userRecord) {
            const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(404, new UsersDto());

            return response;
        }

        const dto: UsersDto = await this.convertToDto(userRecord);


        const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(200, dto);

        return response;
    }


    async findByEmailByRole(email: string, userRole: string,): Promise<ResponseDto<UsersDto>> {

        this.logger.log(`Fetching User Record by Email ${email} and Role ${userRole}`);

        const userRecord: UserDataType[] = await this.userDBService.findByEmailAndRole(email, userRole);


        if (!userRecord || userRecord.length === 0) {
            const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(404, new UsersDto());

            return response;

        }


        const dto: UsersDto = await this.convertToDto(userRecord[0]);

        const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(200, dto);

        return response;
    }


    async findById(userId: string): Promise<ResponseDto<UsersDto>> {


        this.logger.log(`Fetching User Record by Id ${userId}`);

        const userRecord: UserDataType = await this.userDBService.findById(userId);

        if (!userRecord) {

            throw new NotFoundException('User Id Not Found');
        }

        const dto: UsersDto = await this.convertToDto(userRecord);

        const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(200, dto);

        return response;

    }

    async deleteById(userId: string): Promise<ResponseDto<UsersDto>> {

        this.logger.log(`Deleting User Record for ${userId}`);

        await this.findById(userId);

        try {
            await this.userDBService.deleteRecordById(userId);

            const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(204, new UsersDto());

            return response;
        }
        catch (error) {
            throw new BadRequestException('Unable to delete record');
        }



    }

    async findRecordsByEmailWithNamesContaining(
        email: string,
        keywords: string
    ): Promise<ResponseDto<UsersDto[]>> {

        this.logger.log(`Fetching User Records by Email ${email} and Keywords ${keywords}`);

        const records: UserDataType[] = await this.userDBService.findRecordsByEmailWithNamesContaining(email, keywords);


        const dtoList = await this.convertToDtoList(records);
        const response: ResponseDto<UsersDto[]> = new ResponseDto<UsersDto[]>(200, dtoList);

        return response;
    }

    async findRecordswithPaging(
        email: string,
        limit: number,
        direction: string,
        cursorPointer: string
    ): Promise<ResponseDto<PageDto<UsersDto>>> {

        this.logger.log(`Fetching User Records by Email ${email} and Limit ${limit} and Direction ${direction} and Cursor ${cursorPointer}`);

        const userRecords = await this.userDBService.findRecordswithPaging(email, limit, direction, cursorPointer);

        const userRecordsDtoList = await this.convertToDtoList(userRecords.data);

        const userDtoPage = new PageDto(userRecordsDtoList, userRecords.nextCursorPointer, userRecords.prevCursorPointer);

        const response: ResponseDto<PageDto<UsersDto>> = new ResponseDto<PageDto<UsersDto>>(200, userDtoPage);

        return response;


    }

    async convertToDtoList(records: UserDataType[]): Promise<UsersDto[]> {
        const dtoList: UsersDto[] = [];

        for (const record of records) {
            const dto: UsersDto = await this.convertToDto(record);

            dtoList.push(dto);
        }

        return dtoList;
    }

    async convertToDto(record: UserDataType): Promise<UsersDto> {

        const dto: UsersDto = {
            id: record.userId ? record.userId : '',
            email: record.email ? record.email : '',
            firstName: record.firstName ? record.firstName : '',
            lastName: record.lastName ? record.lastName : '',
            userRole: record.userRole as UserRole,
            data: {
                country: record.data?.country ? record.data?.country : '',
            }
        };

        return dto;
    }

}
