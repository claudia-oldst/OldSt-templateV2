import { Typography } from '@ui';
import {
    addDays, addMonths, endOfMonth, endOfWeek, startOfDay, startOfMonth, startOfWeek
} from 'date-fns';
import { DateRange } from 'react-day-picker';
import styles from './calendar.module.scss';

export const options = [
    { label: 'Today', dates: { from: startOfDay(new Date()), to: startOfDay(new Date()) } },
    { label: 'Yesterday', dates: { from: startOfDay(addDays(new Date(), -1)), to: startOfDay(addDays(new Date(), -1)) } },
    { label: 'This week', dates: { from: startOfWeek(new Date()), to: startOfDay(endOfWeek(new Date())) } },
    { label: 'Last week', dates: { from: startOfWeek(addDays(new Date(), -7)), to: startOfDay(endOfWeek(addDays(new Date(), -7))) } },
    { label: 'This month', dates: { from: startOfMonth(new Date()), to: startOfDay(endOfMonth(new Date())) } },
    { label: 'Last month', dates: { from: startOfMonth(addMonths(new Date(), -1)), to: startOfDay(endOfMonth(addMonths(new Date(), -1))) } },
    // { label: 'All time' }
];

interface IDateOptions {
    selected: string;
    handleSelectOption: (value: { label: string, dates: DateRange }) => void
}

const DateOptions = ({ selected, handleSelectOption }: IDateOptions) => {
    return <div className={styles['calendar__options']}>
        {options.map(o =>
            <div onClick={() => handleSelectOption(o)} className='hover:cursor-pointer' key={o.label}>
                <Typography
                    className='whitespace-nowrap hover:text-C600'
                    color={selected === o.label ? 'text-primary400' : 'text-N700'}
                    size='text-sm'
                    fontWeight={selected === o.label ? 'font-bold' : 'font-normal'}>
                    {o.label}
                </Typography>
            </div>
        )}
    </div>;
};

export default DateOptions;
