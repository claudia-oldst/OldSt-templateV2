import { EmailTemplateDataDto, EmailTemplateDto, EmailTemplateType } from '@dto';
import { EmailTemplateDataType } from '@dynamo-db-lib';
import { EmailTemplateDatabaseLibService } from '@email-template-database-lib';
import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { EmailTemplateServiceLibService } from './email-template-service-lib.service';

describe('EmailTemplateServiceLibService', () => {
    let service: EmailTemplateServiceLibService;

    const mockEmailTemplateDBService = {
        deleteById: jest.fn().mockImplementation((emailTemplateId: string) => {
            if (emailTemplateId === '1234567890') {
                return Promise.resolve(null);
            } else {

                return Promise.reject(new BadRequestException('Unable to delete record'));
            }

        }),

        findByTemplateTypeAndLanguage:
            jest.fn().mockImplementation((templateType: string, language: string) => {


                if (templateType === 'SignUp' && language === 'English') {
                    const response: EmailTemplateDataType = {
                        emailTemplateId: '1234567890',
                        GSI2PK: 'SignUp' + '#' + language,
                        data: new EmailTemplateDataDto(),
                        subject: 'Subject',
                    };


                    return response;

                } else {
                    return Promise.resolve(null);
                }
            }),
        createRecord: jest.fn().mockImplementation((data: EmailTemplateDto) => {

            const response: EmailTemplateDataType = {
                emailTemplateId: '1234567890',
                GSI2PK: data.emailTemplateType + '#' + data.language, // 
                data: data.data,
                subject: data.subject,
            };

            return response;

        }),



    };



    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [EmailTemplateServiceLibService, EmailTemplateDatabaseLibService],
        })
            .overrideProvider(EmailTemplateDatabaseLibService)
            .useValue(mockEmailTemplateDBService)
            .compile();

        service = module.get(EmailTemplateServiceLibService);
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeTruthy();
    });


    it('should find a record by template type and language', async () => {
        const result = await service.findByTemplateTypeAndLanguage('SignUp', 'English');

        //expect find by template type and language to be called
        expect(mockEmailTemplateDBService.findByTemplateTypeAndLanguage).toBeCalledWith('SignUp', 'English');

        //expect results to be returned and not null
        expect(result).not.toBeNull();
        expect(result.statusCode).toEqual(200);


    });


    it('should find NOT a record by template type and language', async () => {
        const result = await service.findByTemplateTypeAndLanguage('SignUp', 'Filipino');

        //expect find by template type and language to be called
        expect(mockEmailTemplateDBService.findByTemplateTypeAndLanguage).toBeCalledWith('SignUp', 'Filipino');


        expect(result.statusCode).toEqual(404);

    });



    it('should Delete the record', async () => {
        const result = await service.deleteById('1234567890');

        expect(result.statusCode).toEqual(204);
    });


    it('should throw Exception on Delete', async () => {
        await expect(service.deleteById('0987654321'))
            .rejects.toThrow(new BadRequestException('Unable to delete record'));
    });

    it('it should create a record', async () => {
        const data: EmailTemplateDto = new EmailTemplateDto();

        data.emailTemplateType = EmailTemplateType.SignUp;
        data.language = 'Filipino';
        const result = await service.createRecord(data);

        //expect find by template type and language to be called
        expect(mockEmailTemplateDBService.findByTemplateTypeAndLanguage).toBeCalledWith(data.emailTemplateType, data.language);
        //expect delete by id not be to called inside create record
        expect(mockEmailTemplateDBService.deleteById).not.toBeCalled();

        expect(result.statusCode).toEqual(201);
    });


    it('it should delete the record and then create a record', async () => {
        const data: EmailTemplateDto = new EmailTemplateDto();

        data.emailTemplateType = EmailTemplateType.SignUp;
        data.language = 'English';
        const result = await service.createRecord(data);

        expect(mockEmailTemplateDBService.findByTemplateTypeAndLanguage).toBeCalledWith(data.emailTemplateType, data.language);
        expect(mockEmailTemplateDBService.deleteById).toBeCalled();

        expect(result.statusCode).toEqual(201);

    });

});
