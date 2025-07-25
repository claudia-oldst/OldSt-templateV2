import type { Meta, StoryFn } from '@storybook/react';
import Typography from '../typography/typography';
import Accordion from './accordion';

const Story: Meta<typeof Accordion> = {
    component: Accordion,
    title: 'Components/Data Display/Accordion',
    argTypes: {
    }
};
export default Story;

const Template: StoryFn<typeof Accordion> = (args) => {
    return (
        <Accordion {...args} />
    );
};

export const Default = Template.bind({});
Default.args = {
    children: <Typography>
        This is the content of this accordion
    </Typography>
};
