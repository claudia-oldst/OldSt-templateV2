import clsx from 'classnames';
import { Color, TypographySize, Weight } from '../../../types/typography';

export interface TypographyProps {
    color?: Color,
    fontWeight?: Weight,
    size?: TypographySize,
    children: React.ReactNode | string,
    component?: 'span' | 'p',
    className?: string,
    /**
     * Format should be something like `'font-<name>'`
     * `name` should be declared in tailwind.config.js
     */
    family?: string,
    style?: { [key: string]: number | string },
    onClick?: (value?: unknown) => void
}

export function Typography({
    color = 'text-N800',
    fontWeight = 'font-normal',
    size = 'text-base',
    component = 'p',
    className = '',
    family = 'font-jakarta',
    children,
    style,
    onClick
}: TypographyProps) {
    const Component = component ? component : 'p';

    return (
        <Component className={clsx(color, size, fontWeight, family, className)} style={style} onClick={onClick}>
            {children}
        </Component>
    );
}

export default Typography;
