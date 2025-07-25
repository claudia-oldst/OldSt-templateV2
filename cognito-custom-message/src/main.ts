import { NestFactory } from '@nestjs/core';
import { Callback, Context, Handler } from 'aws-lambda';
import { AppModule } from './app/app.module';
import { AppService } from './app/app.service';

export const handler: Handler = async (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any,
    context: Context,
    callback: Callback
) => {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const service = appContext.get(AppService);

    console.log('Event: ', JSON.stringify(event));
    event = await service.handleEvent(event);
    callback(null, event);
};
