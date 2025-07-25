import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class PageDto<T> {
    @IsArray()
    @ApiProperty({ isArray: true })
    readonly data: T[];

    @ApiProperty()
    nextCursorPointer!: string;

    @ApiProperty()
    prevCursorPointer!: string;

    constructor(data: T[], nextCursorPointer: string, prevCursorPointer: string) {
        this.data = data;

        this.nextCursorPointer = nextCursorPointer;

        this.prevCursorPointer = prevCursorPointer;
    }
}
