import { CreateUserDto } from '@dto';
import { Injectable } from '@nestjs/common';
import { PrismaDbLibService } from '@prisma-db-lib';
import { User } from '@prisma/client';

@Injectable()
export class UserDatabasePrismaLibService {

    constructor(private dbService: PrismaDbLibService) { }


    async createRecord(data: CreateUserDto): Promise<User> {
        return await this.dbService.user.create({
            data: {
                email: data.email,
                fullName: data.firstName + ' ' + data.lastName,
                country: data.data.country,
            },
        });
    }

    async getById(id: string): Promise<User | null> {
        return await this.dbService.user.findUnique({
            where: {
                id: id,
            },
        });
    }

    async getByEmail(email: string): Promise<User | null> {
        return await this.dbService.user.findUnique({
            where: {
                email: email,
            },
        });
    }
}
