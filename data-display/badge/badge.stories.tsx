import type { Meta, StoryFn } from '@storybook/react';
import { Badge as BadgeComponent } from './badge';

const Story: Meta<typeof BadgeComponent> = {
    component: BadgeComponent,
    title: 'Components/Data Display/Badge',
};
export default Story;

const Template: StoryFn<typeof BadgeComponent> = (args) => (
    <BadgeComponent {...args} />
);

export const Badge = Template.bind({});
Badge.args = {
    children: '420'
};
