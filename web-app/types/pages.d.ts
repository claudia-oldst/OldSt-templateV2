import { NextPage } from 'next';
import { ComponentType, ReactNode } from 'react';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}> = NextPage<P> & {
    getLayout?: (page) => ReactNode;
    layout?: ComponentType;
};
