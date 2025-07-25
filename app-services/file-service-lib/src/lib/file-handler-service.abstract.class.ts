import { ResponseDto } from '@dto';

export abstract class FileHandlerService {
    abstract uploadViaSignedUrl(bucket: string, key: string, mimeType: string, expiration: number): Promise<ResponseDto<string>>;
    abstract downloadFileViaUrl(bucket: string, key: string, mimeType: string, expiration: number): Promise<ResponseDto<string>>;
}