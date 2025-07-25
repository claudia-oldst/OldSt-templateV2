/* eslint-disable react/jsx-no-useless-fragment */
import * as RadixTooltip from '@radix-ui/react-tooltip';
import cn from 'classnames';
import { ReactNode } from 'react';
import cx from './tooltip.module.scss';

interface TooltipProps {
    children: JSX.Element
    content: string | ReactNode
    position?: 'top' | 'right' | 'bottom' | 'left',
    align?: 'start' | 'center' | 'end',
    disableHoverableContent?: boolean,
    delayDuration?: number,
    contentClassName?: string,
    avoidCollisions?: boolean,
    className?: string
}

const Tooltip = ({
    children, content, position = 'bottom', disableHoverableContent, delayDuration = 500, contentClassName, avoidCollisions = false, className,
    align = 'start'
}: TooltipProps) => {
    return (
        <div className={cn(cx['tooltip-wrapper'], { [`${className}`]: !!className })}>
            <RadixTooltip.Provider
                delayDuration={delayDuration}>
                <RadixTooltip.Root
                    open={disableHoverableContent}>
                    <RadixTooltip.Trigger asChild={true}>
                        {children}
                    </RadixTooltip.Trigger>
                    <RadixTooltip.Portal>
                        <RadixTooltip.Content
                            side={position}
                            className={cn({ [cx['tooltip-content']]: typeof content === 'string' }, contentClassName)}
                            align={align}
                            avoidCollisions={avoidCollisions}>
                            {content}
                        </RadixTooltip.Content>
                    </RadixTooltip.Portal>
                </RadixTooltip.Root>
            </RadixTooltip.Provider>
        </div>
    );
};

export default Tooltip;
