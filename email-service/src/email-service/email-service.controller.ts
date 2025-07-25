import { EmailDto } from '@dto';
import { EmailServiceLib } from '@email-service-lib';
import { Body, Controller, Inject, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';

@Controller('email')
@ApiTags('email')
export class EmailServiceController {


    constructor(
        @Inject('EmailAWSSesService')
        private readonly emailService: EmailServiceLib) {

    }

    //send email with email subject message as body using emaiDto from @dto librray
    @Post()
    @UseInterceptors(AnyFilesInterceptor())
    @ApiConsumes('multipart/form-data')
    sendEmail(@Body() emailDto: EmailDto, @UploadedFiles(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({ maxSize: 1000000 })
            ]
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ) files: Array<any>) {
        return this.emailService.sendEmailToUser(emailDto, 'dennis@old.st', files);
    }
}
