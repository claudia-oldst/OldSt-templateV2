import { StoryFn } from '@storybook/react';
import { useState } from 'react';
import { Switch as SwitchComponent } from './switch';

export default {
    title: 'Components/Form Controls/Switch',
    component: SwitchComponent,
};

const Template: StoryFn<typeof SwitchComponent> = (args) => {
    const [selected, setSelected] = useState<boolean>(false);

    return (
        <SwitchComponent {...args} enabled={selected} onChange={setSelected} />
    );
};

export const Switch = Template.bind({});
Switch.args = {
};
