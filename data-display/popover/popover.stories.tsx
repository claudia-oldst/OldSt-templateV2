import type { Meta, StoryFn } from '@storybook/react';
import { More } from '../../icons';
import { Popover as PopoverComponent } from './popover';

const Story: Meta<typeof PopoverComponent> = {
    component: PopoverComponent,
    title: 'Components/Data Display/Popover',
};
export default Story;

const Template: StoryFn<typeof PopoverComponent> = (args) => (
    <PopoverComponent {...args} />
);

export const Popover = Template.bind({});
Popover.args = {
    trigger: <div>
        <More className='rotate-90' size={24} />
    </div>,
    children: <div>
        Hello
    </div>
};
