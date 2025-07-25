import colors from '@ui-config/colors';
import cn from 'classnames';
import { NotAvailable } from '../../../icons';
import { Typography } from '../../typography/typography';

/* eslint-disable-next-line */
export interface NoAvailableProps {
    title: string;
    message: string;
    className?: string;
    descClassname?: string;
}

export function NoAvailable({
    title,
    message,
    className,
    descClassname = '',
}: NoAvailableProps) {
    return (
        <div className={cn('text-center p-6', className)}>
            <div className="mb-5">
                <NotAvailable
                    size={56}
                    secondaryColor={colors.N600}
                    color={colors.N400}
                    className="mx-auto"
                />
            </div>
            <Typography color="text-N800" fontWeight="font-semibold">
                {title}
            </Typography>
            <Typography
                color="text-N700"
                className={cn(
                    'mt-2 text-center whitespace-pre-line',
                    descClassname
                )}
            >
                {message}
            </Typography>
        </div>
    );
}

export default NoAvailable;
