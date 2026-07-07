import {initialState, LoginModalValue, LoginState} from "./login.types";

export type LoginAction =
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
        payload: string | null;
    }
    |
    {
        type: "SET_MESSAGE";
        payload: string | null;
    }
    |
    {
        type: "SET_VALUE",
        payload: Partial<LoginModalValue>
    }
    |
    {
        type: "RESET";
    };

export function loginReducer(
    state: LoginState,
    action: LoginAction
): LoginState {

    switch (action.type) {

        case "OPEN_MODAL":
            return {
                ...state,
                isModalOpen: true,
            };

        case "CLOSE_MODAL":
            return {
                ...state,
                isModalOpen: false,
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