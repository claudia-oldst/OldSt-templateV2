import clsx from 'classnames';
import { ButtonType, Variant } from '../../../types/button';
import IIcon from '../../../types/icons';
import { Spinner } from '../../data-display/spinner/spinner';
import styles from './button.module.scss';

/* eslint-disable-next-line */
export interface ButtonProps {
    label: string,
    className?: string,
    variant?: Variant,
    disabled?: boolean,
    isProcessing?: boolean,
    leftIcon?: React.ElementType<IIcon>,
    rightIcon?: React.ElementType<IIcon>,
    type?: ButtonType | undefined,
    onClick?: () => void,
    isRounded?: boolean
}

export function Button({
    label,
    className = '',
    variant = 'primary',
    disabled = false,
    isProcessing = false,
    leftIcon: LeftIcon,
    rightIcon: RightIcon,
    type = 'button',
    onClick,
    isRounded
}: ButtonProps) {

    return (
        <button
            className={clsx(styles['app-button'], styles[`btn-${variant}`], className, { 'rounded-full': isRounded, 'rounded': !isRounded })}
            disabled={disabled || isProcessing}
            type={type}
            onClick={onClick}>
            {isProcessing && (
                <div className={styles.loader}>
                    <Spinner />
                </div>
            )}

            <div className={clsx(styles['btn-content'], { [styles['btn-loading']]: isProcessing })}>
                {LeftIcon && <LeftIcon size={18} />}
                <p className={LeftIcon ? 'pr-2' : RightIcon ? 'pl-2' : ''}>{label}</p>
                {RightIcon && <RightIcon size={18} />}
            </div>
        </button>
    );
}

export default Button;
