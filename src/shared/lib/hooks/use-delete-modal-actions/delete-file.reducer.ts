import {DeleteModalState, initialState} from "./delete-file.types";

export type DeleteModalAction =
    | {
    type: "OPEN";
    payload: {
        file: DeleteModalState["file"];
        user: DeleteModalState["user"];
    };
}
    | {
    type: "CLOSE";
}
    | {
    type: "SET_DELETING";
    payload: boolean;
};

export function deleteFileReducer(
    state: DeleteModalState,
    action: DeleteModalAction
): DeleteModalState {

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