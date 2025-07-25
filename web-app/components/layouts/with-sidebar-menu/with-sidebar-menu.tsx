/* eslint-disable react-hooks/exhaustive-deps */
import { ListLoader } from '@web-app/components/loader/list';
// import { useQueryOrganisations } from "@web-app/hooks/useQueryOrganisations";
import { Dashboard, Evaluations, Groups, Organisations, Reporting } from '@ui';
import clsx from 'classnames';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import styles from './with-sidebar-menu.module.scss';

const Sidebar = dynamic(
    () => import('@ui/src/lib/navigation/sidebar/sidebar'),
    { ssr: false }
);

export interface SidebarMenuProps {
    children?: React.ReactNode,
}

export function SidebarMenu({ children }: SidebarMenuProps) {
    const scrollableDivRef = useRef<HTMLDivElement>();

    const router = useRouter();

    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setIsFetching(false);
        }, 500);
    }, []);

    const handleSelectMenu = (key: string) => {
        router.push(`/${key}`);
        scrollableDivRef.current.scrollTo(0, 0);
    };

    // add condition here if needed to have different menu
    const menu = [{
        sectionTitle: 'Overview',
        menuItems: [
            { label: 'Overview', onClick: handleSelectMenu, icon: Dashboard, key: 'overview' },
            { label: 'Infrastructure', onClick: handleSelectMenu, icon: Evaluations, key: 'infrastructure' },
            { label: 'Fleet Consumption', onClick: handleSelectMenu, icon: Groups, key: 'fleet-consumption' }
        ]
    }, {
        sectionTitle: 'Admin',
        menuItems: [
            { label: 'Notifications', onClick: handleSelectMenu, icon: Reporting, key: 'notifications' },
            { label: 'Settings', onClick: handleSelectMenu, icon: Organisations, key: 'settings' }
        ]
    }];

    const handleLogout = () => {
        router.replace('/auth/login');
    };

    return (
        <div className={clsx(styles['sidebar-wrapper'], 'inline-flex')}>
            <Sidebar
                onLogout={handleLogout}
                menu={menu}
                profile={{
                    name: 'Jane Doe', email: 'jane.doe@email.com'
                }} />
            <div className='h-screen w-full px-14 py-16 overflow-auto scrollbar-hide' ref={scrollableDivRef}>
                {isFetching
                    ? <ListLoader />
                    : children}
            </div>
        </div>
    );
}

export default SidebarMenu;
