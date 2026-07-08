import {RemoveFileState, initialState} from "./remove-file.types";

export type DeleteModalAction =
    | {
    type: "OPEN";
    payload: {
        file: RemoveFileState["file"];
        user: RemoveFileState["user"];
    };
}
    | {
    type: "CLOSE";
}
    | {
    type: "SET_DELETING";
    payload: boolean;
};

export function removeFileReducer(
    state: RemoveFileState,
    action: DeleteModalAction
): RemoveFileState {

    switch (action.type) {

        case "OPEN":
            return {
                ...state,
                open: true,
                file: action.payload.file,
                user: action.payload.user,
                isDeleting: false,
            };

        case "CLOSE":
            return {
                ...initialState,
            };

        case "SET_DELETING":
            return {
                ...state,
                isDeleting: action.payload,
            };

        default:
            return state;
    }
}