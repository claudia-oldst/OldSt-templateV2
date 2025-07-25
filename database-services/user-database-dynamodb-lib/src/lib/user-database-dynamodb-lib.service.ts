import { CreateUserDto, PageDto } from '@dto';
import { DynamoDbService, UserDataType, createDynamoDbOptionWithPKSKIndex } from '@dynamo-db-lib';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserDatabaseDynamodbLibService {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private userTable: any = null;

    constructor(private readonly dynamoDbService: DynamoDbService) {
        this.userTable = this.dynamoDbService
            .dynamoDbMainTable()
            .getModel('User');
    }


    async createRecord(userData: CreateUserDto): Promise<UserDataType> {

        const user: UserDataType = {
            userRole: userData.userRole,
            data: {
                country: userData.data.country,
            },
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email.toLocaleLowerCase(),
        };

        const userRecord: UserDataType = await this.userTable.create(user);

        return userRecord;

    }

    async findById(userId: string): Promise<UserDataType> {

        const dbStats = {};
        const userRecord: UserDataType = await this.userTable.get({
            userId: userId,
        } as UserDataType, {
            stats: dbStats,
        });

        console.log(`User Table Find By Id Query stats: ${JSON.stringify(dbStats)}`);


        return userRecord;

    }

    async findByEmail(email: string): Promise<UserDataType> {

        const dbStats = {};
        const userRecord: UserDataType = await this.userTable.get(
            {
                GSI2PK: email,
            } as UserDataType,
            {
                index: 'GSI2',
                follow: true,
                stats: dbStats,
            }
        );

        console.log(`User Table Find By Email Query stats: ${JSON.stringify(dbStats)}`);


        return userRecord;
    }

    async findByEmailAndRole(email: string, userRole: string): Promise<UserDataType[]> {

        const dbStats = {};
        const userRecords: UserDataType[] = await this.userTable.find(
            {
                GSI1PK: userRole,
                GSI1SK: email,
            } as UserDataType,
            {
                index: 'GSI1',
                follow: true,
                stats: dbStats,
            }
        );

        console.log(`User Table Find By Email and Role Query stats: ${JSON.stringify(dbStats)}`);

        return userRecords;
    }


    async findRecordsByEmailWithNamesContaining(
        email: string,
        keywords: string
    ): Promise<UserDataType[]> {
        const dbStats = {};
        const records: UserDataType[] = await this.userTable.find(
            {
                GSI2PK: email,
            } as UserDataType,
            {
                where: 'contains(${firstName}, @{keywords}) OR contains(${lastName}, @{keywords})',
                substitutions: { keywords: keywords.toLowerCase() },
                index: 'GSI2',
                stats: dbStats,
            }
        );

        console.log(`User Table Find By Email Containing Keywords Query stats: ${JSON.stringify(dbStats)}`);

        return records;
    }

    async findRecordswithPaging(
        userRole: string,
        limit: number,
        direction: string,
        cursorPointer: string
    ): Promise<PageDto<UserDataType>> {
        const dynamoDbOption = createDynamoDbOptionWithPKSKIndex(
            limit,
            'GSI1',
            direction,
            cursorPointer
        );
        const dbStats = {};

        dynamoDbOption['stats'] = dbStats;


        const userRecords = await this.userTable.find(
            {
                GSI1PK: userRole,
            } as UserDataType,
            dynamoDbOption,
        );

        console.log(`User Table Find By Page Query stats: ${JSON.stringify(dbStats)}`);


        return new PageDto(userRecords, userRecords.next, userRecords.prev);
    }

    async deleteRecordById(userId: string): Promise<void> {
        await this.userTable.delete({
            userId: userId,
        } as UserDataType);
    }

}
