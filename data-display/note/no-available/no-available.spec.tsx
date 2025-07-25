import { render } from '@testing-library/react';

import NoAvailable from './no-available';

describe('NoAvailable', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<NoAvailable />);

        expect(baseElement).toBeTruthy();
    });
});
