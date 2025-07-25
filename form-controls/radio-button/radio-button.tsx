import { RadioOff, RadioOn, Typography } from '@ui';
import colors from '@ui-config/colors';
import styles from './radio-button.module.scss';

/* eslint-disable-next-line */
export interface RadioButtonProps {
    isChecked?: boolean,
    onClick?: (value: boolean) => void,
    label?: string
}

export function RadioButton({ isChecked = false, onClick, label }: RadioButtonProps) {

    const handleClick = () => {
        onClick && onClick(!isChecked);
    };

    return (
        <div className={styles['radio-button']} onClick={handleClick}>
            {isChecked
                ? <RadioOn color={colors.primary400} size={20} />
                : <RadioOff color={colors.N500} size={20} />
            }

            {label && <Typography className='whitespace-nowrap'>{label}</Typography>}
        </div>
    );
}

export default RadioButton;
