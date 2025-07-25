import clsx from 'classnames';
import { AlertType } from '../../../types/alert';
import { Close, Error, Info, Success, Warning } from '../../icons';
import Typography from '../typography/typography';
import styles from './toast.module.scss';

/* eslint-disable-next-line */
export interface ToastProps {
    type?: AlertType;
    title?: string;
    description: string;
    onClick: () => void;
}

export function Toast({
    type = 'info',
    title, description,
    onClick
}: ToastProps) {
    const Icon = type === 'info'
        ? Info : type === 'success'
            ? Success : type === 'error'
                ? Error : Warning;
    const textColor = type === 'info'
        ? 'text-info500' : type === 'success'
            ? 'text-success500' : type === 'error'
                ? 'text-error500' : 'text-warning500';

    return (
        <div className={clsx(styles['toast'], styles[`toast--${type}`])}>
            <div className={clsx(textColor, 'flex', 'gap-2', 'flex-1')}>
                <div className='mt-1'>
                    <Icon
                        size={16} />
                </div>

                <div className={styles['toast__message']}>
                    <Typography
                        color={textColor}
                        fontWeight='font-semibold'>
                        {title}
                    </Typography>

                    {description && <Typography color='text-N800'>{description}</Typography>}
                </div>
            </div>

            <div className={styles['Toast__close']} onClick={onClick}>
                <Close size={16} className='text-N600' />
            </div>
        </div>
    );
}

export default Toast;
