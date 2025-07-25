import colors from '@ui-config/colors';
import { Warning } from '../../../icons';
import Typography from '../../typography/typography';

/* eslint-disable-next-line */
export interface ErrorLoadingDataProps { }

export function ErrorLoadingData(props: ErrorLoadingDataProps) {
    return (
        <div className='flex flex-col items-center justify-center p-6'>
            <Warning size={56} color={colors.A100} secondaryColor={colors.A500} />
            <Typography color='text-N800' fontWeight='font-semibold' className='mt-4'>Error loading data</Typography>
            <Typography color='text-N700' className='mt-2 text-center'>
                An error occurred while loading the chart. Please try again later or contact Support for assistance.
            </Typography>
        </div>
    );
}

export default ErrorLoadingData;
