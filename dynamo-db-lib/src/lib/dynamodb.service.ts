import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Entity, Table } from 'dynamodb-onetable';
import { Dynamo } from 'dynamodb-onetable/Dynamo';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Schema } from './schema/schema';


@Injectable()
export class DynamoDbService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private client: any = null;

    constructor(private readonly configService: ConfigService) {
        this.client = new Dynamo({
            client: new DynamoDBClient({
                region: this.configService.get<string>('DEFAULT_REGION'),

            }),

        });
    }

    dynamoDbMainTable() {
        return new Table({
            client: this.client,
            name: this.configService.get<string>('DYNAMO_DB_MAIN_TABLE'),
            partial: true,
            schema: Schema
        });
    }
}

export type UserDataType = Entity<typeof Schema.models.User>;
export type EmailTemplateDataType = Entity<typeof Schema.models.EmailTemplate>;
export type LogDataType = Entity<typeof Schema.models.Logs>;