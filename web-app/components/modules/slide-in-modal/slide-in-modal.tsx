import { Modal, PageHeader } from '@ui';
import clsx from 'classnames';
import { useRouter } from 'next/router';

export interface SlideInModalProps {
    children: React.ReactNode,
    isVisible: boolean,
    title: string
}

export function SlideInModal({ children, isVisible, title }: SlideInModalProps) {
    const router = useRouter();

    const handleCloseModal = () => {
        router.back();
    };

    return (
        <Modal isVisible={isVisible} onToggle={handleCloseModal}>
            <PageHeader title={title} isMainPage={false} />

            <div className={clsx('pt-10 pb-6 h-full overflow-y-scroll scrollbar-hide')}>
                {children}
            </div>
        </Modal>
    );
}

export default SlideInModal;
