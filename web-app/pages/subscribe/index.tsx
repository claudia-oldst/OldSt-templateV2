import PrimaryLayout from '@web-app/components/layouts/primary-layout/primary-layout';
import WithSidebarMenuLayout from '@web-app/components/layouts/with-sidebar-menu/with-sidebar-menu';
import { NextPageWithLayout } from '@web-app/types/pages';
import styles from './index.module.scss';

/* eslint-disable-next-line */
export interface SubscribeProps { }

const Subscribe: NextPageWithLayout<SubscribeProps> = () => {
    return (
        <div className={styles['container']}>
            <h1>Welcome to Subscribe!</h1>
        </div>
    );
};

export default Subscribe;

Subscribe.getLayout = (page) => {
    return (
        <PrimaryLayout title='Settings'>
            <WithSidebarMenuLayout>
                {page}
            </WithSidebarMenuLayout>
        </PrimaryLayout>
    );
};
