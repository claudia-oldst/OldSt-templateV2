import { render } from '@testing-library/react';

import Tabs from './tab';

describe('Tabs', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<Tabs activeKey={''} menu={[]} />);

        expect(baseElement).toBeTruthy();
    });
});
