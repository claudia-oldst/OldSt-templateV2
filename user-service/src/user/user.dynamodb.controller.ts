import { ApiKeyHeaderGuard } from '@auth-guard-lib';
import { CreateUserDto, ResponseDto, UsersDto } from '@dto';
import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Query,
    UseGuards
} from '@nestjs/common';
import {
    // ApiBearerAuth,
    ApiHeader,
    ApiQuery,
    ApiTags
} from '@nestjs/swagger';
import { UserServiceLib } from '@user-service-lib';

@Controller('users-dynamo-db')
@ApiTags('users-dynamo-db')
// @ApiBearerAuth("JWT-auth")
// @UseGuards(CognitoAuthGuard)
export class UserDynamoDbController {
    constructor(
        @Inject('UserServiceDynamoLibService')
        private readonly userService: UserServiceLib
    ) { }

    @Post()
    create(@Body() data: CreateUserDto): Promise<ResponseDto<UsersDto>> {
        return this.userService.createUserRecord(data);
    }

    @Get(':userId')
    getById(@Param('userId') userId: string): Promise<ResponseDto<UsersDto>> {
        return this.userService.findById(userId);
    }

    @Get('/email/:email')
    getByEmail(@Param('email') email: string): Promise<ResponseDto<UsersDto>> {
        return this.userService.findByEmail(email);
    }


    @Get('/email/:email/keywords')
    @ApiQuery({
        name: 'keywords',
        type: String,
        required: true,
        description: 'Keywords for Searching  Names',
    })
    searchEmailWithNames(@Param('email') email: string, @Query('keywords') keywords: string): Promise<ResponseDto<UsersDto[]>> {
        return this.userService.findRecordsByEmailWithNamesContaining(email, keywords);
    }

    @Get('email/:email/role/:role')
    getByRoleAndEmail(
        @Param('role') role: string,
        @Param('email') email: string
    ): Promise<ResponseDto<UsersDto>> {
        return this.userService.findByEmailByRole(email, role);
    }


    @Get('page/user-role/:userRole')
    @ApiQuery({
        name: 'limit',
        type: Number,
        required: true,
        description: 'No of Records to fetch',
    })
    @ApiQuery({
        name: 'direction',
        type: String,
        required: false,
        description: 'Page Direction (nullable) : Possible values "next / prev',
    })
    @ApiQuery({
        name: 'cursorPointer',
        type: String,
        required: false,
        description: 'DB Cursor Pointer - null for first Page',
    })
    findByEmailWithPaging(
        @Param('userRole') userRole: string,
        @Query('limit', ParseIntPipe) limit: number,
        @Query('direction') direction: string,
        @Query('cursorPointer') cursorPointer: string
    ) {
        return this.userService.findRecordswithPaging(
            userRole,
            limit,
            direction,
            cursorPointer
        );
    }


    @Delete(':userId')
    deleteById(@Param('userId') userId: string): Promise<ResponseDto<UsersDto>> {
        return this.userService.deleteById(userId);
    }

    @Get('email-via-api-key/:email')
    @ApiHeader({
        name: 'X-API-KEY',
    })
    @UseGuards(ApiKeyHeaderGuard)
    findUserByEmail(@Param('email') email: string): Promise<ResponseDto<UsersDto>> {
        return this.userService.findByEmail(email);
    }


}
