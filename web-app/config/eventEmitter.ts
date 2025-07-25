/* eslint-disable @typescript-eslint/no-explicit-any */
export const EventEmitter = {
    events: {
        OrgUpdated: 'onOrgUpdated',
        UserUpdate: 'onUserUpdated',
        FolderUpdated: 'onFolderUpdated'
    },
    subscribe(event: string, callback) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(callback);
    },
    dispatch(event: string, data?: any) {
        if (!this.events[event]) return;
        this.events[event].forEach((callback) => callback(data));
    },
    unsubscribe(event: string) {
        if (!this.events[event]) return;
        delete this.events[event];
    },
};