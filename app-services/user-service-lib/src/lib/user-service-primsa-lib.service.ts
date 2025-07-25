import { CreateUserDto, LogsDto, ResponseDto, UsersDto } from '@dto';
import { MessageQueueAwsSqsService } from '@message-queue-lib';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { UserDatabasePrismaLibService } from '@user-database-prisma-lib';
import { UserServiceLib } from './user-service.abstract.class';

@Injectable()
export class UserServicePrismaLibService implements UserServiceLib {

    private readonly logger = new Logger(UserServicePrismaLibService.name);

    constructor(private readonly userDBService: UserDatabasePrismaLibService,
        private readonly configService: ConfigService,

        private readonly messageSender: MessageQueueAwsSqsService,) { }



    public async createUserRecord(userData: CreateUserDto): Promise<ResponseDto<UsersDto>> {


        this.logger.log(`Creating User Record for ${userData.email} `);


        const existingUser: ResponseDto<UsersDto> = await this.findByEmail(userData.email);

        if (existingUser.statusCode === 200) {
            throw new BadRequestException(`User already exists with email: ${existingUser.body.email}`);
        }


        try {
            const userRecord: User = await this.userDBService.createRecord(userData);
            const dto: UsersDto = await this.convertToDto(userRecord);


            //sending log data via sqs 
            const logData: LogsDto = new LogsDto();

            const loggingSQSURL = this.configService.get<string>(
                'AWS_LOGGING_QUEUE_URL'
            );


            logData.action = 'CREATE';
            logData.data = JSON.stringify(userData);
            logData.entityName = 'User';
            logData.referenceId = userRecord.id ? userRecord.id : '';

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

    async findById(id: string): Promise<ResponseDto<UsersDto>> {


        this.logger.log(`Finding User Record for ${id} `);


        const userRecord: User | null = await this.userDBService.getById(id);

        if (!userRecord) {
            const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(404, new UsersDto());

            return response;
        }

        const dto: UsersDto = await this.convertToDto(userRecord);
        const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(200, dto);

        return response;
    }

    async deleteById(id: string): Promise<ResponseDto<UsersDto>> {

        this.logger.log(`Deleting User Record for ${id} `);

        const userRecord: ResponseDto<UsersDto> = await this.findById(id);

        if (userRecord.statusCode != 200) {
            const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(404, new UsersDto());

            return response;
        }

        const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(200, new UsersDto());

        return response;
    }


    async findByEmail(email: string): Promise<ResponseDto<UsersDto>> {

        this.logger.log(`Fetching User Record by Email ${email}`);

        const userRecord: User | null = await this.userDBService.getByEmail(email);

        if (!userRecord) {
            const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(404, new UsersDto());

            return response;
        }

        const dto: UsersDto = await this.convertToDto(userRecord);


        const response: ResponseDto<UsersDto> = new ResponseDto<UsersDto>(200, dto);

        return response;
    }

    async convertToDto(userRecord: User): Promise<UsersDto> {
        const dto: UsersDto = new UsersDto();

        dto.id = userRecord.id;
        dto.email = userRecord.email;

        return dto;
    }
}