import {
    ContextMenuState,
    initialState,
} from "./context-menu.types";

import {UiFile} from "../../../../../../store/types/UiFile";


export type ContextMenuAction =

    | {
    type: "OPEN";

    payload: {
        x: number;
        y: number;
        file: UiFile;
    };
}

    | {
    type: "CLOSE";
}

    | {
    type: "SET_COPIED_FILE";

    payload: UiFile | null;
}

    | {
    type: "RESET";
};


export function contextMenuReducer(
    state: ContextMenuState,
    action: ContextMenuAction
): ContextMenuState {

    switch (action.type) {

        case "OPEN":

            return {

                ...state,

                visible: true,

                clickX: action.payload.x,

                clickY: action.payload.y,

                file: action.payload.file,

            };


        case "CLOSE":

            return {

                ...state,

                visible: false,

                file: null,

            };


        case "SET_COPIED_FILE":

            return {

                ...state,

                copiedFile: action.payload,

            };


        case "RESET":

            return {

                ...initialState,

                menuRef: state.menuRef,

            };


        default:

            return state;

    }

}