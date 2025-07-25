import type { Meta, StoryFn } from '@storybook/react';
import { ChevronDown, Notification } from '../../icons';
import { Button as ButtonComponent } from './button';

const Story: Meta<typeof ButtonComponent> = {
    component: ButtonComponent,
    title: 'Components/Form Controls/Button',
    argTypes: {
        onClick: { action: 'clicked' },
        variant: {
            control: {
                type: 'radio',
                options: ['primary', 'secondary', 'tertiary', 'error']
            }
        }
    }
};
export default Story;

const Template: StoryFn<typeof ButtonComponent> = (args) => (
    <ButtonComponent {...args} />
);

export const Primary = Template.bind({});
Primary.args = {
    label: 'Button',
    variant: 'primary',
};
export const Secordary = Template.bind({});
Secordary.args = {
    label: 'Button',
    variant: 'secondary',
};
export const Tertiary = Template.bind({});
Tertiary.args = {
    label: 'Button',
    variant: 'tertiary',
};
export const Error = Template.bind({});
Error.args = {
    label: 'Button',
    variant: 'error',
};
export const ButtonLeftIcon = Template.bind({});
ButtonLeftIcon.args = {
    label: 'Button',
    variant: 'primary',
    leftIcon: Notification
};
export const ButtonRightIcon = Template.bind({});
ButtonRightIcon.args = {
    label: 'Button',
    variant: 'primary',
    rightIcon: ChevronDown
};
export const ButtonLoading = Template.bind({});
ButtonLoading.args = {
    label: 'Button',
    variant: 'primary',
    isProcessing: true
};

