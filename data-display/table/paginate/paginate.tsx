import colors from '@ui-config/colors';
import cn from 'classnames';
import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from '../../../icons';
import Typography from '../../typography/typography';
import styles from './paginate.module.scss';

/* eslint-disable-next-line */
export interface PaginateProps {
    className?: string,
    totalPerPage: number,
    /**
     * totalItems should be `null` if count over total should not display
     */
    totalItems: number | null,
    /**
     * nextEnabled should be a boolean if totalItems === null
     */
    nextEnabled?: boolean | undefined,
    /**
     * prevEnabled should be a boolean if totalItems === null
     */
    prevEnabled?: boolean | undefined,
    currentPage: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleTotalPerPageChange: (e: any) => void,
    handlePageChange: (value: number, direction: 'prev' | 'next') => void,
    showDisplayPerPage?: boolean
}

export function Paginate({
    className = '', totalPerPage, totalItems, currentPage, handleTotalPerPageChange, handlePageChange,
    nextEnabled, prevEnabled, showDisplayPerPage = true
}: PaginateProps) {
    const isPrevEnabled = useMemo(() => {
        return (prevEnabled && !totalItems) || !(currentPage <= 1);
    }, [currentPage, prevEnabled, totalItems]);

    const isNextEnabled = useMemo(() => {
        return !totalItems ? nextEnabled : ((currentPage * totalPerPage) < totalItems);
    }, [currentPage, nextEnabled, totalItems, totalPerPage]);

    return (
        <div className={styles['pagination']}>
            {showDisplayPerPage && (
                <div className="flex flex-row">
                    <Typography color="text-N700">Rows per page: </Typography>
                    <select
                        onChange={handleTotalPerPageChange}
                        value={totalPerPage}
                        className="outline-none text-N800"
                    >
                        <option>10</option>
                        <option>20</option>
                        <option>50</option>
                        <option>100</option>
                    </select>
                </div>
            )}

            {totalItems && (
                <Typography color='text-N700'>
                    {(currentPage * totalPerPage + 1) - totalPerPage}-{currentPage * totalPerPage > totalItems ? totalItems : currentPage * totalPerPage} of {totalItems}
                </Typography>
            )}

            <div className="flex flex-row gap-4">
                <div
                    onClick={isPrevEnabled ? () => handlePageChange(currentPage - 1, 'prev') : undefined}
                    className={cn({ 'hover:cursor-pointer': isPrevEnabled })}>
                    <ChevronLeft size={16} color={colors[isPrevEnabled ? 'N800' : 'N500']} />
                </div>
                <div
                    onClick={isNextEnabled ? () => handlePageChange(currentPage + 1, 'next') : undefined}
                    className={cn({ 'hover:cursor-pointer': isNextEnabled })}>
                    <ChevronRight size={16} color={colors[isNextEnabled ? 'N800' : 'N500']} />
                </div>
            </div>
        </div>
    );
}

export default Paginate;
