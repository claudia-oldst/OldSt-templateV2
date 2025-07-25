import serverlessExpress from '@codegenie/serverless-express';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import express from 'express';
import { AppModule } from './app/app.module';

let cachedServer: Handler;

async function bootstrap(): Promise<Handler> {

    if (!cachedServer) {
        const expressApp = express();
        const nestApp = await NestFactory.create(
            AppModule,
            new ExpressAdapter(expressApp),
        );

        nestApp.enableCors();
        nestApp.useGlobalPipes(new ValidationPipe());
        const globalPrefix = 'api';

        nestApp.setGlobalPrefix(globalPrefix);

        const config = new DocumentBuilder()
            .setTitle('Email')
            .setDescription('Email API')
            .setVersion('1.0')
            .addBearerAuth(
                {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    name: 'JWT',
                    description: 'Enter JWT token',
                    in: 'header',
                },
                'JWT-auth',
            )
            .build();
        const document = SwaggerModule.createDocument(nestApp, config);

        SwaggerModule.setup('swagger', nestApp, document, { useGlobalPrefix: true });


        await nestApp.init();

        cachedServer = serverlessExpress({ app: expressApp });
    }

    return cachedServer;

}

export const handler: Handler = async (event: APIGatewayEvent, context: Context, callback: Callback) => {

    cachedServer = cachedServer ?? (await bootstrap());

    return cachedServer(event, context, callback);
};