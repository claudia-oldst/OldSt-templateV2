import { render } from '@testing-library/react';

import SlideInModal from './slide-in-modal';

describe('SlideInModal', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<SlideInModal />);

        expect(baseElement).toBeTruthy();
    });
});
