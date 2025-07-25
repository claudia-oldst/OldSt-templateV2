import { render } from '@testing-library/react';

import ErrorLoadingData from './error-loading-data';

describe('ErrorLoadingData', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<ErrorLoadingData />);

        expect(baseElement).toBeTruthy();
    });
});
