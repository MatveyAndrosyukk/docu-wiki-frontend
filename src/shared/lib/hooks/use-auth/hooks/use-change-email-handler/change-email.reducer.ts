import {ChangeEmailState, initialState} from "./change-email.types";

export type EmailAction =
    |
    {
        type: "SET_LOADING";
        payload: boolean;
    }
    |
    {
        type: "SET_ERROR";
        payload: string;
    }
    |
    {
        type: "SET_MESSAGE";
        payload: string;
    }
    |
    {
        type: "SET_VALUE";
        payload: string;
    }
    |
    {
        type: "SET_IS_MODAL";
        payload: boolean;
    }
    |
    {
        type: "RESET";
    };

export function changeEmailReducer(
    state: ChangeEmailState,
    action: EmailAction
): ChangeEmailState {

    switch (action.type) {

        case "SET_LOADING":
            return {
                ...state,
                loading: action.payload,
            };

        case "SET_ERROR":
            return {
                ...state,
                error: action.payload,
            };

        case "SET_MESSAGE":
            return {
                ...state,
                message: action.payload,
            };

        case "SET_VALUE":
            return {
                ...state,
                value: action.payload,
            };

        case "SET_IS_MODAL":
            return {
                ...state,
                isModal: action.payload,
            };

        case "RESET":
            return {
                ...initialState,
            };

        default:
            return state;
    }
}