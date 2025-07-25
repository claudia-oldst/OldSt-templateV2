import { CreateUserDto, PageDto, ResponseDto, UsersDto } from '@dto';

export abstract class UserServiceLib {

    abstract findById(userId: string): Promise<ResponseDto<UsersDto>>

    abstract createUserRecord(userData: CreateUserDto): Promise<ResponseDto<UsersDto>>;

    abstract deleteById(userId: string): Promise<ResponseDto<UsersDto>>;

    findByEmail?(email: string): Promise<ResponseDto<UsersDto>>;

    findRecordsByEmailWithNamesContaining?(email: string, keywords: string): Promise<ResponseDto<UsersDto[]>>;

    findByEmailByRole?(role: string, email: string): Promise<ResponseDto<UsersDto>>;

    findRecordswithPaging?(
        email: string,
        limit: number,
        direction: string,
        cursorPointer: string
    ): Promise<ResponseDto<PageDto<UsersDto>>>

    abstract convertToDto(userRecord: unknown): Promise<UsersDto>;

}