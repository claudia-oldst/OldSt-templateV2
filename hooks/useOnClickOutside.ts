/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';

export const useOnClickOutside = (ref: any, handler: (e: any) => void) => {
    useEffect(() => {
        const listener = (event: any) => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }

            handler(event);
        };

        document.addEventListener('mousedown', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
        };
    }, [ref, handler]);
};
