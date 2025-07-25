/* eslint-disable react-hooks/exhaustive-deps */
import { STORAGE_KEY } from '@web-app/config/constants';
import { motion } from 'framer-motion';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function RouteGuard({ children }) {
    const router = useRouter();

    const [isTransitioned, setIsTransitioned] = useState(false);

    useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.asPath);

        router.events.on('routeChangeStart', handleTransition);
        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck);

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', handleTransition);
            router.events.off('routeChangeComplete', authCheck);
        };

    }, []);

    const checkIfTokenInvalid = (token: string) => {
        if (!token) return true;

        const decoded = JSON.parse(atob(token.split('.')[1]));

        return decoded.exp * 1000 < Date.now();
    };

    const handleTransition = () => {
        setIsTransitioned(true);
    };

    function authCheck(url: string) {
        setIsTransitioned(false);
        // console.log(url);
        // redirect to login page if accessing a private page and not logged in 
        const publicPaths = ['/login', '/create-account', '/enter-otp', '/forgot-password', '/set-new-password'];
        const path = url.split('?')[0];
        const token = Cookies.get(STORAGE_KEY.ACCESS_TOKEN);

        if ((!token || (token && checkIfTokenInvalid(token))) && !publicPaths.includes(path)) {
            // router.replace('/auth/login');
        }
    }

    return isTransitioned
        ? null
        : <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }} >
            {children}
        </motion.div>;
}

export default RouteGuard;
