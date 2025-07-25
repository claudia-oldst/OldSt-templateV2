import { ApiProperty } from '@nestjs/swagger';

export class LogsDto {

  @ApiProperty()
  logId?: string;

  @ApiProperty()
  entityName?: string;

  @ApiProperty()
  referenceId?: string;

  @ApiProperty()
  action?: string;

  @ApiProperty()
  data?: string;

  @ApiProperty()
  user?: string;

}