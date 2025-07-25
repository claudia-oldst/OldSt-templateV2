import colors from '@ui-config/colors';
import clsx from 'classnames';
import * as React from 'react';
import { ChangeEventHandler } from 'react';
import IIcon from '../../../types/icons';
import cx from './input.module.scss';

interface InputProps {
    name?: string,
    variant?: 'default' | 'error' | 'disabled'
    type?: 'text' | 'password' | 'number'
    placeholder?: string
    helperText?: string
    label?: string
    value?: string | number,
    defaultValue?: string | number,
    onChange?: (val: string | number) => void,
    className?: string,
    component?: 'input' | 'textarea',

    leftIcon?: React.ElementType<IIcon>,
    onLeftIconClick?: () => void

    rightIcon?: React.ElementType<IIcon>,
    onRightIconClick?: () => void
}

export const Input = ({
    name,
    variant = 'default',
    type = 'text',
    label,
    placeholder,
    helperText,
    value,
    defaultValue,
    onChange,
    className,
    leftIcon: LeftIcon,
    onLeftIconClick,
    rightIcon: RightIcon,
    onRightIconClick,
    component: Component = 'input',
    ...rest
}: InputProps) => {
    const [val, setVal] = React.useState<string | number>('');

    React.useEffect(() => {
        if (value) {
            setVal(value);
        }
    }, []);

    // const onInputChange = (e) => {
    const onInputChange: (ChangeEventHandler<HTMLInputElement> & ChangeEventHandler<HTMLTextAreaElement>) = (e) => {
        const value = e.target.value;

        setVal(value);
        onChange && onChange(value);
    };

    return (
        <div className={clsx(cx['input-wrapper'], {
            [cx['input-error']]: variant === 'error',
            [cx['input-disabled']]: variant === 'disabled',
            [cx['--textarea']]: Component === 'textarea',
            [`${className}`]: !!className
        })}>
            <div className={cx['input-field']}>

                {!!LeftIcon &&
                    <div onClick={onLeftIconClick} className={cx['input__icon']}>
                        <LeftIcon size={20} />
                    </div>
                }

                <Component
                    name={name}
                    type={type}
                    readOnly={variant === 'disabled'}
                    className={clsx(cx['input'], 'bg-transparent', { 'hover:cursor-default': variant === 'disabled' })}
                    placeholder={placeholder || label}
                    value={value ? val : undefined}
                    defaultValue={defaultValue}
                    spellCheck={false}
                    rows={4}
                    onChange={onInputChange}
                    {...rest} />
                <div className={clsx(cx['label'], {
                    [cx['label-with-placeholder']]: placeholder?.length !== 0,
                    // [cx['label-with--prefixIcon']]: withPrefixIcon
                })}>{label}</div>

                {!!RightIcon &&
                    <div onClick={onRightIconClick} className={clsx(cx['input__icon'], onRightIconClick ? 'hover:cursor-pointer' : '')}>
                        <RightIcon size={20} color={variant === 'error' ? colors.error500 : undefined} />
                    </div>
                }

            </div>

            <div className={cx['helper-text']}>{helperText}</div>
        </div>
    );
};

export default Input;
