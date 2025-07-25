
import { ReactNode } from 'react';

/* eslint-disable-next-line */
export interface AuthenticationProps {
    children: ReactNode
}

export function AuthenticationLayout({ children }: AuthenticationProps) {
    return (
        <div className='flex justify-center items-center h-screen w-screen overflow-auto scrollbar-hide'>
            <div className='w-[28rem] pb-3 mt-10'>
                {children}
            </div>
        </div>
    );
}

export default AuthenticationLayout;
