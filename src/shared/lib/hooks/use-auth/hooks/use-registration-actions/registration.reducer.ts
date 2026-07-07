import {initialState, RegisterModalValue, RegisterState} from "./registration.types";

export type RegisterAction =
    |
    {
        type: "SET_LOADING";
        payload: boolean;
    }
    |
    {
        type: "SET_ERROR";
        payload: string | null;
    }
    |
    {
        type: "SET_MESSAGE";
        payload: string | null;
    }
    |
    {
        type: "SET_IS_MODAL";
        payload: boolean;
    }
    |
    {
        type: "SET_VALUE";
        payload: Partial<RegisterModalValue>;
    }
    |
    {
        type: "RESET";
    };

export function registrationReducer(
    state: RegisterState,
    action: RegisterAction
): RegisterState {

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