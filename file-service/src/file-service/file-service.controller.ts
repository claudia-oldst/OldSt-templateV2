import { FileHandlerService } from '@file-service-lib';
import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('file-services')
@ApiTags('file-services')
export class FileServiceController {

    constructor(
        @Inject('FileHandlerAWSS3Service')
        private readonly fileService: FileHandlerService
    ) { }


    @Get('upload-url')
    async uploadFile(
        @Query('bucketName') bucketName: string,
        @Query('key') key: string,
        @Query('mimeType') mimeType: string,
        @Query('expiration') expiration: number
    ) {
        return await this.fileService.uploadViaSignedUrl(
            bucketName,
            key,
            mimeType,
            expiration
        );
    }

    @Get('download-url')
    async downloadFile(
        @Query('bucketName') bucketName: string,
        @Query('key') key: string,
        @Query('mimeType') mimeType: string,
        @Query('expiration') expiration: number
    ) {
        return await this.fileService.downloadFileViaUrl(
            bucketName,
            key,
            mimeType,
            expiration
        );
    }
}
