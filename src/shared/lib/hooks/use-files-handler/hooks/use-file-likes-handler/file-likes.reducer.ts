import {
    FileLikesState,
    initialState,
} from "./file-likes.types";

export type FileLikesAction =
    | {
    type: "SET_IS_LIKING";
    payload: boolean;
}
    | {
    type: "RESET";
};

export function fileLikesReducer(
    state: FileLikesState,
    action: FileLikesAction
): FileLikesState {
    switch (action.type) {
        case "SET_IS_LIKING":
            return {
                ...state,
                isLiking: action.payload,
            };

        case "RESET":
            return {
                ...initialState,
            };

        default:
            return state;
    }
}