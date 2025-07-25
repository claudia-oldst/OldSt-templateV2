import { render } from '@testing-library/react';

import PrimaryLayout from './primary-layout';

describe('PrimaryLayout', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<PrimaryLayout />);

        expect(baseElement).toBeTruthy();
    });
});
