import { Typography } from '@ui';
import colors from '@ui-config/colors';
import cn from 'classnames';
import { addMonths, startOfMonth } from 'date-fns';
import { useState } from 'react';
import { DateRange, DayPicker, SelectRangeEventHandler } from 'react-day-picker';
import styles from './calendar.module.scss';
import DateOptions, { options } from './dateOptions';

/* eslint-disable-next-line */
export interface CalendarProps {
    onChange?: (dateRange: DateRange) => void,
    selectedDates?: DateRange// | string
}

export function Calendar({ onChange, selectedDates }: CalendarProps) {
    const [range, setRange] = useState<DateRange | undefined>(selectedDates);
    const [selectedOption, setSelectedOption] = useState('Today');

    /**
     * Set selected date options (today, yesterday, this week...)
     * Then apply selected date range based on options
     * @param {Object} value { label: option label, dates: { from: Date, to: Date }}
     */
    const handleSelectOption = (value: { label: string, dates: DateRange }) => {
        setSelectedOption(value.label);
        setRange(value.dates);
        // update selectedDates prop value
        onChange && onChange(value.dates);
    };

    /**
     * Triggered onClick date
     * Set range and update selectedOption if it is equal to range
     * @param {Object} range DateRange { from: Date, to: Date }
     * @param {Date} selectedDay date clicked
     */
    const handleSelectRange = (range: DateRange, selectedDay: Date) => {
        // range becomes undefined when date is deselected
        // use selectedDay if range is undefined
        const updatedRange = range ? { ...range, to: range.to || range.from } : { from: selectedDay, to: selectedDay };

        setRange(updatedRange);

        let updateSelectedOption = '';

        [...Array(6)].forEach((_, i) => {
            if (JSON.stringify(updatedRange) === JSON.stringify(options[i].dates)) {
                updateSelectedOption = options[i].label;
            }
        });
        setSelectedOption(updateSelectedOption);
        // update selectedDates prop value
        onChange && onChange(updatedRange);
    };

    return (
        <div className={styles.container}>
            <DateOptions
                selected={selectedOption}
                handleSelectOption={handleSelectOption} />

            <div className='py-2'>
                <DayPicker
                    mode='range'
                    selected={range}
                    onSelect={handleSelectRange as SelectRangeEventHandler}
                    numberOfMonths={2}
                    defaultMonth={startOfMonth(addMonths(new Date(), -1))}
                    formatters={{
                        formatWeekdayName: (date) => (
                            <Typography color='text-N600' fontWeight='font-bold'>
                                {`${date}`.substring(0, 2)}
                            </Typography>
                        ),
                        formatDay: (date) => (
                            <Typography color='text-N800' size='text-sm' className={cn(styles['calendar-day'], 'h-10 w-10 py-[0.625rem]')}>
                                {date.getDate()}
                            </Typography>
                        )
                    }}
                    modifiersClassNames={{
                        range_start: styles['range-start'],
                        range_end: styles['range-end'],
                        selected: styles['selected'],
                    }}
                    styles={{
                        caption_label: { fontSize: 16, color: colors.N800 },
                        nav: { fontSize: 10, color: colors.N600 },
                        head_cell: { fontSize: 14, color: colors.N600, marginTop: 8 },
                        table: { paddingTop: '0.5rem', borderTop: '1px solid', borderTopColor: colors.N400 },
                        caption: { marginBottom: '1rem' },
                        day: { fontSize: 12, border: 'none' },
                    }} />
            </div>
        </div>
    );
}

export default Calendar;
