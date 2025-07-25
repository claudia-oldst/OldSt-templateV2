import { BadRequestException } from '@nestjs/common';

export function createDynamoDbOptionWithPKSKIndex(
    limit: number,
    indexName: string,
    direction: string,
    cursorPointer: string
) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dbOptions: { [key: string]: any } = {};


    dbOptions['limit'] = limit;
    dbOptions['follow'] = true;


    if (direction != null) {
        dbOptions[direction] = {};

        if (cursorPointer == null) {
            throw new BadRequestException(
                'Cursor Pointer Can\'t be null if direction is not null'
            );
        }

        dbOptions[direction] = JSON.parse(cursorPointer);
    }

    if (indexName != null) {
        dbOptions['index'] = indexName;
    }

    return dbOptions;
}
