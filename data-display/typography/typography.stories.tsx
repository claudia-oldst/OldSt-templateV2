import type { Meta } from '@storybook/react';
import { Typography } from './typography';

const Story: Meta<typeof Typography> = {
    component: Typography,
    title: 'Components/Data Display/Typography',
    argTypes: {
        onClick: { action: 'clicked' }
    }
};
export default Story;

export const Default = {
    args: {
        children: 'Sample'
    },
};
export const OtherFont = {
    args: {
        family: 'font-orienta',
        children: 'Sample',
        size: 'text-2xl'
    },
};
