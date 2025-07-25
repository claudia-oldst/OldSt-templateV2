
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function Index() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/auth/login');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div />;
}

export default Index;
