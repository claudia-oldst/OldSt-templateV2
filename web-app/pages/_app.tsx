import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import '@ui/styles';
import FlashNotification from '@web-app/components/modules/flash-notification/flash-notification';
import { AppProps } from 'next/app';
import { useState } from 'react';
import '../styles/styles.scss';
import { NextPageWithLayout } from '../types/pages';

interface AppPropsWithLayout extends AppProps {
    Component: NextPageWithLayout
}

function CustomApp({ Component, pageProps }: AppPropsWithLayout) {
    const getLayout = Component.getLayout || ((page) => page);

    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: { queries: { staleTime: 1000 * 60 * 5 } }
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {getLayout(<Component {...pageProps} />)}

            <FlashNotification />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default CustomApp;
