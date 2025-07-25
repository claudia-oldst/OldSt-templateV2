import { EmailDto, ResponseDto } from '@dto';


export abstract class EmailServiceLib {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    abstract sendEmailToUser(data: EmailDto, fromEmail: string, files: any[]): Promise<ResponseDto<string>>;

}