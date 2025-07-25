import {
    GetObjectCommand,
    PutObjectCommand,
    S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { Readable } from 'stream';


@Injectable()
export class AwsS3LibService {
    private awsS3Config: S3Client;
    constructor(private readonly configService: ConfigService) {
        this.awsS3Config = new S3Client({
            region: this.configService.get<string>('DEFAULT_REGION'),
        });
    }

    async getS3Object(bucket: string, name: string) {
        const input = {
            Bucket: bucket,
            Key: name,
        };
        const command = new GetObjectCommand(input);
        const response = await this.awsS3Config.send(command);

        return response.Body as Readable;
    }

    async getS3ObjectAsBuffer(bucket: string, key: string, mimeType: string) {
        const input = {
            Bucket: bucket,
            Key: key,
            ContentType: mimeType,
        };
        const command = new GetObjectCommand(input);

        //todo make this work
        const signedUrl = await getSignedUrl(this.awsS3Config, command, {
            expiresIn: 3600,
        }); // URL expires in 1 hour

        // Use the pre-signed URL to download the object as a buffer
        const response = await axios.get(signedUrl, {
            responseType: 'arraybuffer',
        });
        const buffer = Buffer.from(response.data, 'binary');

        return buffer;
    }

    async getDownloadSignedUrl(
        bucket: string,
        key: string,
        mimeType: string,
        expiration: number
    ) {
        const input = {
            Bucket: bucket,
            Key: key,
            ContentType: mimeType,
        };
        const command = new GetObjectCommand(input);
        const signedUrl = await getSignedUrl(this.awsS3Config, command, {
            expiresIn: expiration,
        });

        return signedUrl;
    }

    async uploadFile(
        folderName: string,
        bucketName: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        file: any,
        newFileName: string
    ) {
        const { originalname } = file;
        let fileName = originalname;

        if (newFileName != null) {
            fileName = newFileName;
        }

        const bucketS3 = bucketName;

        return await this.uploadS3(
            file,
            file.mimetype,
            bucketS3,
            folderName + '/' + fileName
        );
    }

    async uploadS3(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        file: any,
        mimeType: string,
        bucket: string,
        key: string
    ) {
        const input = {
            Bucket: bucket,
            Key: key,
            mimeType: mimeType,
            Body: file.buffer,
        };
        const command = new PutObjectCommand(input);
        const response = await this.awsS3Config.send(command);

        return response;
    }

    async uploadBuffer(
        folderName: string,
        bucketName: string,
        originalname: string,
        data: Buffer,
        mimetype: unknown
    ) {
        const bucketS3 = bucketName;

        return await this.uploadS3FromBuffer(
            data,
            mimetype,
            bucketS3,
            folderName + '/' + originalname
        );
    }

    async uploadS3FromBuffer(
        data: Buffer,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        mimetype: any,
        bucket: string,
        name: string
    ) {
        const input = {
            Bucket: bucket,
            Key: String(name),
            Body: data,
            ContentType: mimetype,
        };
        const command = new PutObjectCommand(input);
        const response = await this.awsS3Config.send(command);

        return response;
    }

    async getUploadSignedUrl(
        bucket: string,
        key: string,
        mimeType: string,
        expiration: number
    ) {
        const input = {
            Bucket: bucket,
            Key: key,
            ContentType: mimeType,
        };
        const command = new PutObjectCommand(input);
        const signedUrl = await getSignedUrl(this.awsS3Config, command, {
            expiresIn: expiration,
        });

        return signedUrl;
    }
}
