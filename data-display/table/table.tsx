/* eslint-disable no-prototype-builtins */
import { NoAvailable, Paginate, Sort, Typography } from '@ui';
import cn from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import Loader from '../loader/loader';

export interface IPagination {
    currentPage: number;
    totalPerPage: number;
    sortBy: string;
    isAsc: boolean;
}
export interface IHeaderTable { key: string, label: string, align?: 'left' | 'right' }

export interface TableProps<T> {
    list: T[],
    /**
     * header key value should match field names
     */
    headers: IHeaderTable[],
    /**
     * used for search and sortBy keys
     */
    sortKeys?: Array<string>,

    /**
     * Display loader
     */
    isLoadingData?: boolean,
    /**
     * Set max number of items per page
     */
    itemsPerPage?: number,

    withPagination?: boolean,

    onPaginate?: (pagination: IPagination) => void,
    totalItems: number | null,

    /**
     * Enable display per page
     */
    showDisplayPerPage?: boolean;
    loaderSize?: number;
}

type ObjectValue = { [key: string]: string };

// eslint-disable-next-line @typescript-eslint/ban-types
export const Table = <T extends {}>({
    headers,
    list = [],
    withPagination,
    sortKeys = [],
    isLoadingData,
    itemsPerPage = 10,
    onPaginate,
    totalItems = null,
    showDisplayPerPage,
    loaderSize = 5,
}: TableProps<T>) => {
    const [sortBy, setSortBy] = useState<typeof sortKeys[number]>(sortKeys[0]);
    const [isAsc, setIsAsc] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPerPage, setTotalPerPage] = useState<number>(itemsPerPage);

    useEffect(() => {
        if (onPaginate) {
            onPaginate({ currentPage, totalPerPage, sortBy, isAsc });
        }
    }, [sortBy, isAsc, currentPage, totalPerPage, onPaginate]);

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore

    const sortData = useMemo(() => {
        const sortedArray = list.sort((a: ObjectValue, b: ObjectValue) => {
            if (isAsc) {
                if (a[sortBy] < b[sortBy]) return -1;
                else if (a[sortBy] > b[sortBy]) return 1;
            } else {
                if (a[sortBy] > b[sortBy]) return -1;
                else if (a[sortBy] < b[sortBy]) return 1;
            }

            return 0;
        });

        return sortedArray.slice((currentPage - 1) * totalPerPage, currentPage * totalPerPage);
    }, [list, isAsc, sortBy, totalPerPage, currentPage]);

    const handlePageChange = (toPage: number) => {
        setCurrentPage(toPage);
    };

    const shouldIndent = (i: number) => {
        return i === 0 || i === headers.length - 1;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleTotalPerPageChange = (e: any) => {
        setTotalPerPage(parseInt(e.target.value));
        setCurrentPage(1);
    };

    /**
     * Handles sorting of data based on the given key.
     *
     * @param {string} key - The key to sort the data by.
     */
    const handleSort = (key: string) => {
        if (key === sortBy) {
            setIsAsc(!isAsc);
        } else {
            setSortBy(key);
            setIsAsc(true);
        }

        setCurrentPage(1);
    };

    return (
        <table className='table-auto border-collapse relative w-full bg-ui-07'>
            <thead className='bg-white border-b border-N100'>
                <tr className='border-t border-b border-t-N100 border-b-N100'>
                    {headers.map(({ key, label, align }, i) =>
                        <th className={cn([`px-4 py-3 top-0 bg-N75 text-${align || 'left'}`], { 'px-8': shouldIndent(i) })} key={key}>
                            {label
                                ? <div className='flex flex-row items-center'>
                                    <Typography size='text-sm' color='text-N700' fontWeight='font-semibold' className={cn({ 'text-right': align === 'right' })}>
                                        {label}
                                    </Typography>

                                    {Boolean(sortKeys.length && sortKeys.includes(key)) &&
                                        <div onClick={() => handleSort(key)} className='px-1 cursor-pointer'>
                                            <Sort size={15} isAsc={isAsc} isActive={key === sortBy} />
                                        </div>
                                    }
                                </div>
                                : null}
                        </th>
                    )}
                </tr>
            </thead>
            <tbody>
                {isLoadingData ? (
                    [...Array(loaderSize)].map((_, i) => (
                        <tr key={i} className='border-b border-N300 transition'>
                            {headers.map(({ key, align }, i) => (
                                <td className={cn('p-4', { 'px-8': shouldIndent(i) })} key={key} >
                                    <Loader className={cn('h-3 w-1/2 max-w-[11rem] rounded-full', { 'float-right': align === 'right' })} />
                                </td>
                            ))}
                        </tr>
                    ))
                ) : sortData.length ? (
                    sortData.map(
                        (item: { [key: string]: string }, i: number) => (
                            <tr key={i} className='border-b border-N300 transition' >
                                {headers.map(({ key, align }, i) => (
                                    <td
                                        className={cn('p-4', {
                                            'px-8': shouldIndent(i),
                                            [`${item.hasOwnProperty(`${key}Component`) ? 'float' : 'text'}-right`]: align === 'right',
                                        })}
                                        key={key} >
                                        {item.hasOwnProperty(`${key}Component`)
                                            ? item[`${key}Component`]
                                            : <div className='flex flex-row gap-2 items-center'>
                                                <Typography
                                                    color='text-N800'
                                                    fontWeight={key === sortBy ? 'font-bold' : 'font-normal'}
                                                    className={cn({ 'flex-1': !item[`${key}SiblingComponent`] })} >
                                                    {item[key]}
                                                </Typography>
                                                {item[`${key}SiblingComponent`]}
                                            </div>
                                        }
                                    </td>
                                ))}
                            </tr>
                        )
                    )
                ) : (
                    <tr className='border-none'>
                        <td colSpan={headers.length} className={'p-4 text-center'} >
                            <NoAvailable
                                title='No Results Found'
                                message='Sorry, we couldn’t find any results that match your search. Please try again\nwith different keywords.'
                            />
                        </td>
                    </tr>
                )}

                {(withPagination && !isLoadingData) ? (
                    <tr className={cn({ 'invisible pointer-events-none': !(!isLoadingData && sortData.length) })}>
                        <td colSpan={headers.length} className='px-8 py-6'>
                            <Paginate
                                totalItems={totalItems}
                                totalPerPage={totalPerPage}
                                currentPage={currentPage}
                                handleTotalPerPageChange={handleTotalPerPageChange}
                                handlePageChange={handlePageChange}
                                showDisplayPerPage={showDisplayPerPage}
                            />
                        </td>
                    </tr>
                ) : null}
            </tbody>
        </table>
    );
};

export default Table;
