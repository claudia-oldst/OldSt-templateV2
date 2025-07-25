import { Disclosure, Transition } from '@headlessui/react';
import cn from 'classnames';
import { TypographySize } from '../../../types/typography';
import { ChevronDown, ChevronUp } from '../../icons';
import Typography from '../typography/typography';
import styles from './accordion.module.scss';

export interface AccordionProps {
    /** add `label` for text toggles only */
    label?: string,
    labelSize?: TypographySize,

    /** supply `triggerToggle` if custom toggle is needed */
    triggerToggle?: React.ReactNode,

    /** show Chevron icon if enabled */
    withIcon?: boolean,

    /** content to display */
    children: React.ReactNode,
    className?: string,
    contentClassName?: string
}

export function Accordion({ label = 'Placeholder label', labelSize = 'text-base', triggerToggle, className, children, withIcon = true, contentClassName = styles['accordion__panel'] }: AccordionProps) {
    return (
        <Disclosure as='div' className={cn(styles.accordion, className)}>
            {({ open }) => (
                <>
                    <Disclosure.Button className={styles['accordion__trigger']}>
                        {triggerToggle
                            ? triggerToggle
                            : <Typography size={labelSize}>{label}</Typography>}
                        {withIcon &&
                            <div>
                                {!open
                                    ? <ChevronDown size={20} />
                                    : <ChevronUp size={20} />
                                }
                            </div>}
                    </Disclosure.Button>

                    <Transition
                        enter='transition duration-100 ease-out'
                        enterFrom='-translate-y-5 opacity-0'
                        enterTo='translate-y-0 opacity-100'
                        leave='transition ease-out duration-100'
                        leaveFrom='translate-y-0 opacity-100'
                        leaveTo='-translate-y-5 opacity-0'
                    >
                        <Disclosure.Panel className={contentClassName}>
                            {children}
                        </Disclosure.Panel>
                    </Transition>
                </>
            )}
        </Disclosure>
    );
}

export default Accordion;