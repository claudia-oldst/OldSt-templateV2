import { motion } from 'framer-motion';
import styles from './backdrop.module.scss';

/* eslint-disable-next-line */
export interface BackdropProps {
    children: JSX.Element,
    onClick: () => void
}

export function Backdrop({ children, onClick }: BackdropProps) {

    return (
        <motion.div
            key='modal'
            onClick={onClick}
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}>
            {children}
        </motion.div>
    );
}

export default Backdrop;
