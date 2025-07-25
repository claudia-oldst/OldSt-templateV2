import type { Meta, StoryFn } from '@storybook/react';
import CalendarComponent from './calendar';

const Story: Meta<typeof CalendarComponent> = {
    component: CalendarComponent,
    title: 'Components/Form Controls/Calendar',
    argTypes: { onChange: { action: 'clicked' } }
};
export default Story;

const Template: StoryFn<typeof CalendarComponent> = (args) => (
    <CalendarComponent {...args} />
);

export const Calendar = Template.bind({});
Calendar.args = {
};
