import {initialState, ResetState, ResetValue} from "./reset.types";

export type ResetAction =
    |
    {
        type: "OPEN_MODAL";
    }
    |
    {
        type: "CLOSE_MODAL";
    }
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
        type: "SET_IS_MODAL";
        payload: boolean;
    }
    |
    {
        type: "SET_VALUE";
        payload: Partial<ResetValue>;
    }
    |
    {
        type: "RESET";
    };

export function resetReducer(
    state: ResetState,
    action: ResetAction
): ResetState {

    switch (action.type) {

        case "OPEN_MODAL":
            return {
                ...state,
                isModal: true,
            };

        case "CLOSE_MODAL":
            return {
                ...state,
                isModal: false,
            };

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

        case "SET_IS_MODAL":
            return {
                ...state,
                isModal: action.payload,
            };

        case "SET_VALUE":
            return {
                ...state,
                value: {
                    ...state.value,
                    ...action.payload,
                },
            };

        case "RESET":
            return {
                ...initialState,
            };

        default:
            return state;
    }
}