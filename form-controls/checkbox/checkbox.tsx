import colors from '@ui-config/colors';
import { Color } from '../../../types/typography';
import Typography from '../../data-display/typography/typography';
import { CheckboxOff, CheckboxOn } from '../../icons';
import styles from './checkbox.module.scss';

/* eslint-disable-next-line */
export interface CheckboxProps {
    isChecked?: boolean,
    onClick?: (value: boolean) => void,
    label: string,
    isDisabled?: boolean,
    color?: string,
    labelColor?: Color
}

export function Checkbox({ isChecked = false, onClick, label = 'Placeholder', isDisabled = false, color, labelColor }: CheckboxProps) {
    const handleClick = () => {
        if (!isDisabled) {
            onClick && onClick(!isChecked);
        }
    };

    return (
        <div className={styles['checkbox']} onClick={isDisabled ? undefined : handleClick}>
            <div>
                {isChecked
                    ? <CheckboxOn color={color || colors.primary400} size={20} className={isDisabled ? 'opacity-10' : ''} />
                    : <CheckboxOff color={color || colors.N500} size={20} className={isDisabled ? 'opacity-10' : ''} />
                }

            </div>
            <Typography color={isDisabled ? 'text-N500' : labelColor} className='whitespace-nowrap'>{label}</Typography>
        </div>
    );
}

export default Checkbox;
