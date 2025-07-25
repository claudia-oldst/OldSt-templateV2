import { Module } from '@nestjs/common';
import { PrismaDbLibModule } from '@prisma-db-lib';
import { UserDatabasePrismaLibService } from './user-database-prisma-lib.service';

@Module({
    imports: [PrismaDbLibModule],
    providers: [UserDatabasePrismaLibService],
    exports: [UserDatabasePrismaLibService],
})
export class UserDatabasePrismaLibModule { }
