import JSTimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import ReactTimeAgo from 'react-time-ago';
import Typography from '../typography/typography';

JSTimeAgo.addLocale(en);

/* eslint-disable-next-line */
export interface TimeAgoProps {
    date: Date;
    isLiveData?: boolean;
}

export function TimeAgo({ date = new Date(), isLiveData = false }: TimeAgoProps) {
    if (isLiveData) return (
        <Typography size='text-sm' color='text-G500' className='leading-6'>
            Showing live data
        </Typography>
    );

    return (
        <Typography size='text-sm' color='text-N600' className='leading-6'>
            Updated <ReactTimeAgo date={date} locale="en-US" timeStyle='round-minute' />
        </Typography>
    );
}

export default TimeAgo;
