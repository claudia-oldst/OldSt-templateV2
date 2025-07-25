/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Popover as HeadlessUIPopover, Transition } from '@headlessui/react';
import { Placement } from '@popperjs/core';
import clsx from 'classnames';
import { Fragment, ReactNode, useState } from 'react';
import { usePopper } from 'react-popper';
import style from './popover.module.scss';

/* eslint-disable-next-line */
export interface PopoverProps {
    children: ReactNode
    trigger: ReactNode
    placement?: Placement
    buttonClassname?: string
    panelClassname?: string,
    isToggleOnHover?: boolean,
    disabled?: boolean
}

/** This serves as the wrapper for tooltip */
export function Popover({
    children, trigger, placement = 'auto-start', buttonClassname = '', panelClassname = '', isToggleOnHover,
    disabled
}: PopoverProps) {
    const [isVisible, setIsVisible] = useState(false);

    const [referenceElement, setReferenceElement] = useState();
    const [popperElement, setPopperElement] = useState();
    const { styles, attributes } = usePopper(referenceElement, popperElement, {
        placement
    });

    return (
        <div className={style['popover']} >
            <HeadlessUIPopover className='relative'>
                {/** @ts-ignore */}
                <HeadlessUIPopover.Button className={clsx(buttonClassname, 'outline-none')} ref={setReferenceElement}>
                    <div
                        onMouseEnter={isToggleOnHover ? () => setIsVisible(true) : undefined}
                        onMouseLeave={isToggleOnHover ? () => setIsVisible(false) : undefined}>
                        {trigger}
                    </div>
                </HeadlessUIPopover.Button>

                <Transition
                    as={Fragment}
                    show={disabled ? false : isToggleOnHover ? isVisible : undefined}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 translate-y-1"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 translate-y-1"
                >
                    <HeadlessUIPopover.Panel
                        className={style['popover__panel']}
                        // @ts-ignore
                        ref={setPopperElement}
                        style={styles.popper}
                        {...attributes.popper}>
                        <div className={clsx(style['popover__panel-content'], panelClassname)}>
                            {children}
                        </div>
                    </HeadlessUIPopover.Panel>
                </Transition>
            </HeadlessUIPopover>
        </div>
    );
}

export default Popover;