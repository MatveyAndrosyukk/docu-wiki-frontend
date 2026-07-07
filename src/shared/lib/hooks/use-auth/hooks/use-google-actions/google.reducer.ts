import {GoogleState, initialState} from "./google.types";

export type GoogleAction =
    | {
    type: "SET_LOADING";
    payload: boolean;
}
    | {
    type: "SET_ERROR";
    payload: string | null;
}
    | {
    type: "RESET";
};

export function googleReducer(
    state: GoogleState,
    action: GoogleAction
): GoogleState {

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

        case "RESET":
            return {
                ...initialState,
            };

        default:
            return state;
    }
}