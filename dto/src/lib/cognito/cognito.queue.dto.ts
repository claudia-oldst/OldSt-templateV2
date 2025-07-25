import { AuthenticationAction } from '@dto';
import { ApiProperty } from '@nestjs/swagger';

export class CognitoQueueDto {
    @ApiProperty()
    action!: AuthenticationAction;

    @ApiProperty()
    email!: string;

    @ApiProperty()
    password!: string;

    @ApiProperty()
    code!: string;
}
