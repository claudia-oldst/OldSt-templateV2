import { StoryFn } from '@storybook/react';
import Button from '../../form-controls/button/button';
import { Info } from '../../icons';
import PageHeaderComponent from './page-header';

export default {
    title: 'Components/Data Display/PageHeader',
    component: PageHeaderComponent,
};

const Template: StoryFn<typeof PageHeaderComponent> = (args) => <PageHeaderComponent {...args} />;

export const Default = Template.bind({});
Default.args = {
    title: 'Page Title',
    leftAction: <Info size={20} />,
    rightAction: <Button label='button' onClick={() => alert('hello')} />
};
