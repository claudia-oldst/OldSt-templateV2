import { AnimatePresence, motion } from 'framer-motion';
import { Close } from '../../icons';
import Backdrop from '../backdrop/backdrop';
import styles from './drawer.module.scss';

/* eslint-disable-next-line */
export interface IDrawer {
    children: React.ReactNode,
    onToggle: () => void,
    isVisible: boolean
    isFullWidth?: boolean
}

export function Drawer({ children, onToggle, isVisible, isFullWidth }: IDrawer) {
    return (
        <AnimatePresence initial={false}>
            {isVisible && (
                <Backdrop onClick={onToggle}>
                    <motion.aside
                        onClick={(e) => e.stopPropagation()}
                        className={styles.drawer}
                        initial={{ width: 0 }}
                        animate={{ width: isFullWidth ? '100%' : 672 }}
                        exit={{ width: 0 }}>
                        <div className='h-full relative'>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={onToggle}
                                className={styles['drawer__close']}>
                                <Close size={24} />
                            </motion.div>
                            {children}
                        </div>
                    </motion.aside>
                </Backdrop >
            )}
        </AnimatePresence>
    );
}

export default Drawer;
