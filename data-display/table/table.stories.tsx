import type { Meta, StoryFn } from '@storybook/react';
import { Warning } from '../../icons';
import Badge from '../badge/badge';
import { Table as TableComponent } from './table';

const Story: Meta<typeof TableComponent> = {
    component: TableComponent,
    title: 'Components/Data Display/Table',
};
export default Story;

const list = [
    {
        vendor_id: '0001',
        client: 'Comfirm',
        clientSiblingComponent: <Warning size={15} />,
        updated_at: '2020/03/02 11:16 am',
        status: 'dead',
        statusComponent: <Badge>
            dead
        </Badge>
    },
    {
        vendor_id: '0002',
        client: 'Musanpoly',
        updated_at: '2020/09/15 11:13 pm',
        status: 'dead',
        statusComponent: <Badge>
            dead
        </Badge>
    },
    {
        vendor_id: '0003',
        client: 'Isoplex',
        updated_at: '2020/03/15 05:52 pm',
        status: 'dead',
        statusComponent: <Badge>
            dead
        </Badge>
    },
    {
        vendor_id: '0004',
        client: 'Prosure',
        updated_at: '2021/06/12 06:47 am',
        status: 'sent',
        statusComponent: <Badge variant='cyan'>
            sent
        </Badge>
    },
    {
        vendor_id: '0005',
        client: 'Kaggle',
        updated_at: '2020/01/28 03:39 pm',
        status: 'dead',
        statusComponent: <Badge>
            dead
        </Badge>
    },
    {
        vendor_id: '0006',
        client: 'Sonique',
        updated_at: '2021/03/30 08:54 pm',
        status: 'signed',
        statusComponent: <Badge variant='lightGreen'>
            signed
        </Badge>
    },
    {
        vendor_id: '0007',
        client: 'Zentime',
        updated_at: '2020/10/10 04:19 am',
        status: 'live',
        statusComponent: <Badge variant='orange'>
            live
        </Badge>
    },
    {
        vendor_id: '0008',
        client: 'Buzzopia',
        updated_at: '2020/04/16 05:22 pm',
        status: 'signed',
        statusComponent: <Badge variant='lightGreen'>
            signed
        </Badge>
    },
    {
        vendor_id: '0009',
        client: 'Ronbert',
        updated_at: '2020/04/24 09:53 am',
        status: 'sent',
        statusComponent: <Badge variant='cyan'>
            sent
        </Badge>
    },
    {
        vendor_id: '0010',
        client: 'Ecratic',
        updated_at: '2020/06/06 06:49 am',
        status: 'dead',
        statusComponent: <Badge>
            dead
        </Badge>
    },
    {
        vendor_id: '0011',
        client: 'Providco',
        updated_at: '2021/06/14 10:40 am',
        status: 'dead',
        statusComponent: <Badge>
            dead
        </Badge>
    },
    {
        vendor_id: '0012',
        client: 'Viagrand',
        updated_at: '2020/06/29 02:33 am',
        status: 'dead',
        statusComponent: <Badge>
            dead
        </Badge>
    },
    {
        vendor_id: '0013',
        client: 'Enomen',
        updated_at: '2021/04/14 07:52 pm',
        status: 'dead',
        statusComponent: <Badge>
            dead
        </Badge>
    },
    {
        vendor_id: '0014',
        client: 'Crustatia',
        updated_at: '2021/03/17 03:57 am',
        status: 'signed',
        statusComponent: <Badge variant='lightGreen'>
            signed
        </Badge>
    },
    {
        vendor_id: '0015',
        client: 'Orbean',
        updated_at: '2020/12/20 03:55 pm',
        status: 'signed',
        statusComponent: <Badge variant='lightGreen'>
            signed
        </Badge>
    },
    {
        vendor_id: '0016',
        client: 'Musix',
        updated_at: '2020/09/16 09:36 pm',
        status: 'live',
        statusComponent: <Badge variant='orange'>
            live
        </Badge>
    },
    {
        vendor_id: '0017',
        client: 'Inventure',
        updated_at: '2020/05/26 02:09 pm',
        status: 'live',
        statusComponent: <Badge variant='orange'>
            live
        </Badge>
    },
    {
        vendor_id: '0018',
        client: 'Sultraxin',
        updated_at: '2020/11/02 07:32 am',
        status: 'live',
        statusComponent: <Badge variant='orange'>
            live
        </Badge>
    },
    {
        vendor_id: '0019',
        client: 'Biohab',
        updated_at: '2020/10/13 04:38 am',
        status: 'dead',
        statusComponent: <Badge>
            dead
        </Badge>,
    },
    {
        vendor_id: '0020',
        client: 'Amtap',
        updated_at: '2021/05/06 08:53 am',
        status: 'live',
        statusComponent: <Badge variant='orange'>
            live
        </Badge>
    },
    {
        vendor_id: '0021',
        client: 'Suretech',
        updated_at: '2020/01/08 03:45 am',
        status: 'signed',
        statusComponent: <Badge variant='lightGreen'>
            signed
        </Badge>
    },
    {
        vendor_id: '0022',
        client: 'Enaut',
        updated_at: '2020/02/05 12:05 am',
        status: 'live',
        statusComponent: <Badge variant='orange'>
            live
        </Badge>
    },
    {
        vendor_id: '0023',
        client: 'Scenty',
        updated_at: '2020/09/17 12:26 am',
        status: 'signed',
        statusComponent: <Badge variant='lightGreen'>
            signed
        </Badge>
    },
    {
        vendor_id: '0024',
        client: 'Ezentia',
        updated_at: '2020/02/22 02:13 pm',
        status: 'live',
        statusComponent: <Badge variant='orange'>
            live
        </Badge>
    },
    {
        vendor_id: '0025',
        client: 'Vurbo',
        updated_at: '2020/03/24 08:07 pm',
        status: 'signed',
        statusComponent: <Badge variant='lightGreen'>
            signed
        </Badge>
    },
    {
        vendor_id: '0026',
        client: 'Kongene',
        updated_at: '2021/02/03 12:49 am',
        status: 'live',
        statusComponent: <Badge variant='orange'>
            live
        </Badge>
    },
    {
        vendor_id: '0027',
        client: 'Voratak',
        updated_at: '2021/06/06 03:36 am',
        status: 'signed',
        statusComponent: <Badge variant='lightGreen'>
            signed
        </Badge>
    },
    {
        vendor_id: '0028',
        client: 'Vinch',
        updated_at: '2020/08/16 07:35 am',
        status: 'dead',
        statusComponent: <Badge>
            dead
        </Badge>
    },
    {
        vendor_id: '0029',
        client: 'Multiflex',
        updated_at: '2020/10/15 03:16 pm',
        status: 'signed',
        statusComponent: <Badge variant='lightGreen'>
            signed
        </Badge>
    }
];
const Template: StoryFn<typeof TableComponent> = (args) => (
    <TableComponent {...args} />
);

const props = {
    headers: [
        { key: 'vendor_id', label: 'Vendor #' },
        { key: 'client', label: 'Client' },
        { key: 'status', label: 'Status' },
        { key: 'updated_at', label: 'Last Updated' },
        { key: 'view', label: '' }
    ],
    list: list.map(item => ({
        ...item,
        viewComponent: <div>
            <a href='/'>View</a>
        </div>
    })),
};

export const Table = Template.bind({});
Table.args = {
    withPagination: true,
    totalItems: list.length,
    sortKeys: [
        'vendor_id',
        'client',
        'status'
    ],
    ...props
};

export const LoadingTable = Template.bind({});
LoadingTable.args = {
    withPagination: true,
    isLoadingData: true,
    loaderSize: 10,
    ...props
};

export const NoTotalItems = Template.bind({});
NoTotalItems.args = {
    withPagination: true,
    ...props
};