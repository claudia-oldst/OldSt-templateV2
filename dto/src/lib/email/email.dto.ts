import { ApiProperty } from '@nestjs/swagger';



export class EmailDto {


  @ApiProperty()
  email!: string;

  @ApiProperty()
  body!: string;

  @ApiProperty()
  subject!: string;

  @ApiProperty({ type: 'file', format: 'binary', isArray: true })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any  
  files?: any[];

}
