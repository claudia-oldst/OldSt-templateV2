import { ResponseDto } from '@dto';


export abstract class MessageQueueService {
    abstract sendMessage(destination: string, message: string): Promise<ResponseDto<string>>;
}