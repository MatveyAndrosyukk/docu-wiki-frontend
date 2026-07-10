import {EditFileState, initialState} from "./edit-mode.types";

export type EditFileAction =
    | {
    type: "SET_IS_EDITING";
    payload: boolean;
}
    | {
    type: "SET_IS_FILE_CONTENT_CHANGED";
    payload: boolean;
}
    | {
    type: "SET_IS_TRY_TO_SWITCH_WHILE_EDITING";
    payload: boolean;
}
    | {
    type: "SET_SWITCHED_FILE_ID";
    payload: number | null;
}
    | {
    type: "SET_CONTENT_ERROR";
    payload: string;
}
    | {
    type: "RESET";
};

export function editModeReducer(
    state: EditFileState,
    action: EditFileAction
): EditFileState {

    switch (action.type) {

        case "SET_IS_EDITING":
            return {
                ...state,
                isEditing: action.payload,
            };

        case "SET_IS_FILE_CONTENT_CHANGED":
            return {
                ...state,
                isFileContentChanged: action.payload,
            };

        case "SET_IS_TRY_TO_SWITCH_WHILE_EDITING":
            return {
                ...state,
                isTryToSwitchWhileEditing: action.payload,
            };

        case "SET_SWITCHED_FILE_ID":
            return {
                ...state,
                switchedFileId: action.payload,
            };

        case "SET_CONTENT_ERROR":
            return {
                ...state,
                contentError: action.payload,
            };

        case "RESET":
            return {
                ...initialState,
            };

        default:
            return state;
    }

}