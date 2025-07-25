import type { Meta, StoryFn } from '@storybook/react';
import TooltipComponent from './tooltip';

const Story: Meta<typeof TooltipComponent> = {
    component: TooltipComponent,
    title: 'Components/Data Display/Tooltip',
};
export default Story;

const Template: StoryFn<typeof TooltipComponent> = (args) => {

    return (
        <div className="flex w-full h-screen justify-center items-center">
            <p>
                Lorem ipsum  <TooltipComponent {...args}>{args.children}</TooltipComponent>
            </p>
        </div>
    );
};


export const Default = Template.bind({});
Default.args = {
    children: <span><u>hover me</u></span>,
    content: 'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.',
    position: 'top'
};

