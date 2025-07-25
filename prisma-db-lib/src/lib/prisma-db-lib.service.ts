import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaDbLibService extends PrismaClient implements OnModuleInit {

    constructor(private configService: ConfigService) {

        super({
            datasources: {
                db: {
                    url: configService.get<string>('DATABASE_URL')
                }
            },
            // log: [
            //   {
            //     emit: 'event',
            //     level: 'query',
            //   },
            // ],
        });

    }
    async onModuleInit() {

        // disabling prisma for now
        //await this.$connect();


        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // this.$on('query', async (e) => {
        //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //   // @ts-ignore
        //   console.log(`${e.query} ${e.params}`);
        // });
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}
