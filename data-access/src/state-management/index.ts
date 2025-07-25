import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { IAuthUser, createAuthedUserSlice } from './createAuthedUserSlice';
import { IFlashNotificationState, createFlashNotificationSlice } from './createFlashNotificationSlice';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IStore extends IFlashNotificationState, IAuthUser { }

/**
 * Make sure to enforce type for each slice
 */

export const useStore = create<IStore>()(
    persist(
        (set, get, api) => ({
            ...createFlashNotificationSlice(set, get, api),
            ...createAuthedUserSlice(set, get, api)
        }),
        {
            name: 'app-storage',
            storage: createJSONStorage(() => sessionStorage)
        },
    ),
);