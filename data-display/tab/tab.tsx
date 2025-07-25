import { Tab as HeadlessUITab } from '@headlessui/react';
import cn from 'classnames';
import Typography from '../typography/typography';
import styles from './tab.module.scss';

export interface TabProps {
    activeIndex: number
    menu: { label: string, key: string }[]
    onChange?: (activeIndex: number) => void
}

export function Tab({
    activeIndex, menu, onChange
}: TabProps) {

    const handleOnChange = (newKey: number) => {
        onChange && onChange(newKey);
    };

    return (
        <HeadlessUITab.Group onChange={handleOnChange} selectedIndex={activeIndex}>
            <HeadlessUITab.List className={styles['tab']}>
                {menu.map((item, i) =>
                    <HeadlessUITab
                        key={item.key}
                        className={cn(styles['tab__item'], { [styles['-active']]: activeIndex === i })}>
                        <Typography color={activeIndex === i ? 'text-primary400' : 'text-N800'}>{item.label}</Typography>
                    </HeadlessUITab>
                )}
            </HeadlessUITab.List>
        </HeadlessUITab.Group>
    );
}

export default Tab;
