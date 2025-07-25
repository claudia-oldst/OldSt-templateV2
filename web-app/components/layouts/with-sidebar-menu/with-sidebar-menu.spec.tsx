import { render } from '@testing-library/react';

import SidebarMenu from './with-sidebar-menu';

describe('SidebarMenu', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<SidebarMenu />);

        expect(baseElement).toBeTruthy();
    });
});
