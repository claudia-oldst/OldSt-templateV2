import { Module } from '@nestjs/common';
import { PrismaDbLibService } from './prisma-db-lib.service';

@Module({
    controllers: [],
    providers: [PrismaDbLibService],
    exports: [PrismaDbLibService],
})
export class PrismaDbLibModule { }
