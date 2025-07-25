import { Dialog, Transition } from '@headlessui/react';
import classNames from 'classnames';
import { Fragment } from 'react';
import Spinner from '../../data-display/spinner/spinner';
import Typography from '../../data-display/typography/typography';
import Button from '../../form-controls/button/button';
import styles from './modal.module.scss';

/* eslint-disable-next-line */
export interface IModal {
    children?: React.ReactNode
    onToggle?: () => void
    onToggleLabel?: string
    isVisible?: boolean
    title?: string
    message?: string
    className?: string
    withGradientBg?: boolean
    autoClose?: boolean
    isLoading?: boolean
}

export function Modal({ children, onToggle, onToggleLabel, isVisible = false, title, message, className, withGradientBg, autoClose = false, isLoading }: IModal) {
    const handleOnClose = (shouldClose = true) => {
        if (shouldClose) {
            onToggle && onToggle();
        }
    };

    return (
        <Transition appear={true} show={isVisible} as={Fragment}>
            <Dialog as='div' className={styles['modal']} onClose={() => handleOnClose(autoClose)}>
                <Transition.Child
                    as={Fragment}
                    enter='ease-out duration-300'
                    enterFrom='opacity-0'
                    enterTo='opacity-100'
                    leave='ease-in duration-200'
                    leaveFrom='opacity-100'
                    leaveTo='opacity-0'>
                    <div className={styles['modal__backdrop']} />
                </Transition.Child>

                <div className='fixed inset-0 overflow-y-auto'>
                    <div className='flex min-h-full items-center justify-center p-4 text-center'>
                        <Transition.Child
                            as={Fragment}
                            enter='ease-out duration-300'
                            enterFrom='opacity-0 scale-95'
                            enterTo='opacity-100 scale-100'
                            leave='ease-in duration-200'
                            leaveFrom='opacity-100 scale-100'
                            leaveTo='opacity-0 scale-95'>
                            <Dialog.Panel className={classNames(styles['modal__content'], { [styles['-withGradientBg']]: withGradientBg }, className)}>
                                {children}

                                {title &&
                                    <div className='p-10 grid gap-10'>
                                        {isLoading &&
                                            <div className='mx-auto'>
                                                <Spinner size={48} />
                                            </div>
                                        }

                                        <Dialog.Title
                                            as={Typography}
                                            color='text-N900'
                                            size='text-2xl'>
                                            {title}
                                        </Dialog.Title>


                                        {message &&
                                            <Typography size='text-lg'>{message}</Typography>
                                        }

                                        {(!!onToggle && onToggleLabel) &&
                                            <Button
                                                label={onToggleLabel}
                                                onClick={handleOnClose}
                                                className='w-full' />
                                        }
                                    </div>
                                }
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}

export default Modal;
