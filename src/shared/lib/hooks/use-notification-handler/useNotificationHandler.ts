import {useCallback, useReducer, useRef} from "react";

import {
    NotificationActionsState,
    initialState,
} from "./notification.types";
import {notificationReducer} from "./notification.reducer";

export const useNotificationHandler = (
    duration = 3000
): NotificationActionsState => {

    const timer = useRef<NodeJS.Timeout | null>(null);

    const [state, dispatch] = useReducer(
        notificationReducer,
        {
            ...initialState,
            timer,
        }
    );

    const close = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        dispatch({
            type: "START_CLOSING",
        });

        setTimeout(() => {
            dispatch({
                type: "FINISH_CLOSING",
            });
        }, 350);
    }, []);

    const show = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
        }

        dispatch({
            type: "SHOW",
        });

        timer.current = setTimeout(close, duration);
    }, [close, duration]);

    return {
        state,
        actions: {
            show,
            close,
        },
    };
};