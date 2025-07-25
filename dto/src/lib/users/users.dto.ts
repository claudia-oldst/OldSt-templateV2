import { ApiProperty } from '@nestjs/swagger';
import { UserDataDto } from './users.data.dto';

export class UsersDto {

  @ApiProperty()
  id!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty({ enum: ['USER', 'ADMIN'] })
  userRole!: 'USER' | 'ADMIN';

  @ApiProperty()
  firstName!: string;

  @ApiProperty()
  lastName!: string;

  @ApiProperty()
  @ApiProperty({ type: () => UserDataDto })
  data!: UserDataDto;
}