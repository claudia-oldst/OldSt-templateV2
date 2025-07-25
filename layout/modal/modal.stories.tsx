import { ComponentStory } from '@storybook/react';
import { useState } from 'react';
import { Modal as Component } from './modal';

export default {
    title: 'Components/Overlays/Modal',
    component: Component,
};

const Template: ComponentStory<typeof Component> = (args) => {
    const [modalOpen, setModalOpen] = useState(false);

    const close = () => setModalOpen(false);
    const open = () => setModalOpen(true);

    return (
        <div>
            <button onClick={() => (modalOpen ? close() : open())} >
                Launch modal
            </button>
            <Component {...args} onToggle={close} isVisible={modalOpen} />
        </div>
    );
};

export const Modal = Template.bind({});
Modal.args = {
    title: 'Here are your search results',
    message: 'We\'ve used AI to help include or exclude results based on your clinical parameters. If you need to change this, simply hover over a row and Verify/Reject the decision.',
    className: 'gradient-bg',
    onToggle: () => console.info('CLOSE'),
    onToggleLabel: 'Close'
};
