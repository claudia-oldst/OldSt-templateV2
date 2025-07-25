import { useStore } from '@data-access/state-management';
import { Toast } from '@ui';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

/* eslint-disable-next-line */
export interface FlashNotificationProps { }

export function FlashNotification(props: FlashNotificationProps) {
    const clearFlashNotification = useStore(state => state.clearFlashNotification);
    const message = useStore(state => state.message);
    const alertType = useStore(state => state.alertType);
    const title = useStore(state => state.title);
    const duration = useStore(state => state.duration);

    useEffect(() => {
        if (message) {
            setTimeout(() => {
                clearFlashNotification();
            }, duration);
        }
    }, [message, duration]);

    const handleClose = () => {
        clearFlashNotification();
    };

    return (
        <div className="absolute bottom-14 left-14 drop-shadow-elevation-03">
            <AnimatePresence initial={false}>
                {message && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.3 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{
                            opacity: 0,
                            scale: 0.5,
                            transition: { duration: 0.2 },
                        }}
                    >
                        <Toast
                            type={alertType}
                            title={title}
                            description={message}
                            onClick={() => handleClose()}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default FlashNotification;
