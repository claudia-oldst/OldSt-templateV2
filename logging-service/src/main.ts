/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

export const handler: Handler = async (
    event: any,
    context: Context,
    callback: Callback
) => {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const service = appContext.get(AppService);

    return service.handleMessage(event.Records);
};
