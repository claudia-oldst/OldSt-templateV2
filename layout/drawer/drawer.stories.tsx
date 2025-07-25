import { ComponentStory } from '@storybook/react';
import { useState } from 'react';
import { Drawer as Component } from './drawer';

export default {
    title: 'Components/Overlays/Drawer',
    component: Component,
};

const Template: ComponentStory<typeof Component> = (args) => {
    const [DrawerOpen, setDrawerOpen] = useState(false);

    const close = () => setDrawerOpen(false);
    const open = () => setDrawerOpen(true);

    return (
        <div>
            <button onClick={() => (DrawerOpen ? close() : open())} >
                Launch Drawer
            </button>
            <Component {...args} onToggle={close} isVisible={DrawerOpen} />
        </div>
    );
};

export const Drawer = Template.bind({});
Drawer.args = {
    children: <div>Hello</div>
};
