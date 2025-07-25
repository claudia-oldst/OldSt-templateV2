import { AwsSesLibService } from '@aws-ses-lib';
import { EmailDto, EmailNotificationDto } from '@dto';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmailAWSSesService } from './email-lib.service.aws.ses';

describe('EmailAWSSesService', () => {
    let service: EmailAWSSesService;

    const mockAwsSesLibService = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        sendEmail: jest.fn().mockImplementation((data: EmailNotificationDto) => {

            console.log(data.toAddress);

            if (data.toAddress === 'send@old.st') {
                return Promise.resolve('Email Sent Successfully');
            } else {
                return Promise.reject(new BadRequestException('Unable to send email record'));

            }
        }),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [EmailAWSSesService, AwsSesLibService],
        })
            .overrideProvider(AwsSesLibService)
            .useValue(mockAwsSesLibService)
            .compile();

        service = module.get(EmailAWSSesService);
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });

    //send email successfully
    it('should send email successfully', async () => {
        const data: EmailDto = {
            email: 'send@old.st',
            subject: 'Test',
            body: 'Test',

        };
        const fromEmail = 'dennis@old.st';
        const files: unknown[] = [];
        const result = await service.sendEmailToUser(data, fromEmail, files);


        expect(result.statusCode).toEqual(200);
    });

    //send email should fail
    it('should send should fail', async () => {
        const data: EmailDto = {
            email: 'error@old.st',
            subject: 'Test',
            body: 'Test',

        };
        const fromEmail = 'dennis@old.st';
        const files: unknown[] = [];
        const result = await service.sendEmailToUser(data, fromEmail, files);


        expect(result.statusCode).toEqual(400);
    });
});
