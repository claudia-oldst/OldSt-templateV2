import { StateCreator } from 'zustand';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface IFlashNotification {
    message?: string;
    title?: string;
    alertType?: AlertType;
    duration?: number;
}

export interface IFlashNotificationState extends IFlashNotification {
    setFlashNotification: (values: IFlashNotification) => void,
    clearFlashNotification: () => void
}

const initialState = {
    message: '',
    alertType: 'info' as AlertType,
    duration: 4000,
};

export const createFlashNotificationSlice: StateCreator<IFlashNotificationState> = set => ({
    ...initialState,
    setFlashNotification: (value: IFlashNotification) =>
        set((state) => ({
            ...state,
            ...value
        })),
    clearFlashNotification: () => set(initialState)
});