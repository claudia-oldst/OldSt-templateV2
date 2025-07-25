import { LogDatabaseLibModule } from '@log-database-lib';
import { Module } from '@nestjs/common';
import { LogServiceLibService } from './log-service-lib.service';

@Module({
    imports: [LogDatabaseLibModule],
    providers: [LogServiceLibService],
    exports: [LogServiceLibService],
})
export class LogServiceLibModule { }
