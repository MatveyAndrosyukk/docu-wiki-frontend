import {NotificationState, initialState} from "./notification.types";

export type NotificationAction =
    | {
    type: "SHOW";
}
    | {
    type: "START_CLOSING";
}
    | {
    type: "FINISH_CLOSING";
}
    | {
    type: "RESET";
};

export function notificationReducer(
    state: NotificationState,
    action: NotificationAction
): NotificationState {
    switch (action.type) {
        case "SHOW":
            return {
                ...state,
                visible: true,
                closing: false,
                id: state.id + 1,
            };

        case "START_CLOSING":
            return {
                ...state,
                closing: true,
            };

        case "FINISH_CLOSING":
            return {
                ...state,
                visible: false,
                closing: false,
            };

        case "RESET":
            return {
                ...initialState,
                timer: state.timer,
            };

        default:
            return state;
    }
}