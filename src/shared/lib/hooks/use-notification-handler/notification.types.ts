import {RefObject} from "react";

export type NotificationState = {
    visible: boolean;
    closing: boolean;
    id: number;
    timer: RefObject<NodeJS.Timeout | null>;
};

export type NotificationActions = {
    show(): void;
    close(): void;
};

export type NotificationActionsState = {
    state: NotificationState;
    actions: NotificationActions;
};

export const initialState: Omit<NotificationState, "timer"> = {
    visible: false,
    closing: false,
    id: 0,
};