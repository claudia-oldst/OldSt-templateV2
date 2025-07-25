import { Module } from '@nestjs/common';

import { AuthenticationModule } from '../authentication/authentication.module';
import { UserModule } from '../user/user.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
    imports: [UserModule, AuthenticationModule,],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
