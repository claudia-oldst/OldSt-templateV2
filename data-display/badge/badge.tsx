import cn from 'classnames';
import styles from './badge.module.scss';

/* eslint-disable-next-line */
export interface BadgeProps {
    children?: string,
    variant?: 'cyan' | 'cornflower' | 'lightGreen' | 'neutral' | 'violet' | 'turquoise' | 'orange' | 'pink' | 'error' | 'success' | 'error',
    isRounded?: boolean,
    isDot?: boolean,
    size?: 'sm' | 'md' | 'lg'
}

export function Badge({ children, variant = 'neutral', isRounded, isDot, size = 'sm' }: BadgeProps) {

    if (isDot) {
        return <div className={cn(styles['badge--status'], styles[variant], styles[`--${size}`])} />;
    }

    return (
        <div className={cn(styles.badge, styles[variant], styles[`--${size}`], isRounded ? 'rounded-full' : 'rounded')}>
            <p className='antialiased'>
                {children}
            </p>
        </div>
    );
}

export default Badge;
