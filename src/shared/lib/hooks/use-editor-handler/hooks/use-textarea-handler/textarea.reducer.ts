import {TextareaState,} from "./textarea.types";

export type TextareaAction =
    | {
    type: "CHANGE_CONTENT";
    payload: string;
}
    | {
    type: "RESET";
    payload: string;
};

export function textareaReducer(
    state: TextareaState,
    action: TextareaAction
): TextareaState {

    switch (action.type) {

        case "CHANGE_CONTENT":

            return {

                ...state,

                content: action.payload,

            };

        case "RESET":

            return {

                ...state,

                content: action.payload,

            };

        default:

            return state;

    }

}