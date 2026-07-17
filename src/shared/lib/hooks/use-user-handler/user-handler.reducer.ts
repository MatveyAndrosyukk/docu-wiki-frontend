import {User} from "../../../../store/slices/userSlice";
import {
    initialState,
    UserHandlerState
} from "./user-handler.types";

export type UserHandlerAction =
    | {
    type: "SET_ADDING_EDITOR";
    payload: boolean;
}
    | {
    type: "SET_CHANGING_NAME";
    payload: boolean;
}
    | {
    type: "SET_EDITING_NAME";
    payload: boolean;
}
    | {
    type: "SET_EDITED_NAME";
    payload: string;
}
    | {
    type: "SET_MODAL_OPEN";
    payload: boolean;
}
    | {
    type: "SET_MODAL_VALUE";
    payload: string;
}
    | {
    type: "SET_EDITORS";
    payload: User[];
}
    | {
    type: "SET_EDITED_NAME_ERROR";
    payload: string;
}
    | {
    type: "SET_ADD_EDITOR_ERROR";
    payload: string;
}
    | {
    type: "SET_CHANGE_NAME_ERROR";
    payload: string;
}
    | {

    type: "CANCEL_NAME_EDIT";

}
    | {

    type: "RESET_MODAL";
}
    | {
    type: "RESET";
};

export function userHandlerReducer(
    state: UserHandlerState,
    action: UserHandlerAction
): UserHandlerState {

    switch (action.type) {

        case "SET_ADDING_EDITOR":
            return {
                ...state,
                isAddingEditor: action.payload,
            };

        case "SET_CHANGING_NAME":
            return {
                ...state,
                isChangingName: action.payload,
            };

        case "SET_EDITING_NAME":
            return {
                ...state,
                isEditingName: action.payload,
            };

        case "SET_EDITED_NAME":
            return {
                ...state,
                editedName: action.payload,
            };

        case "SET_MODAL_OPEN":
            return {
                ...state,
                isModalOpen: action.payload,
            };

        case "SET_MODAL_VALUE":
            return {
                ...state,
                modalValue: action.payload,
            };

        case "SET_EDITORS":
            return {
                ...state,
                editors: action.payload,
            };

        case "SET_EDITED_NAME_ERROR":
            return {
                ...state,
                editedNameError: action.payload,
            };

        case "SET_ADD_EDITOR_ERROR":
            return {
                ...state,
                addEditorError: action.payload,
            };

        case "SET_CHANGE_NAME_ERROR":
            return {
                ...state,
                changeNameError: action.payload,
            };

        case "CANCEL_NAME_EDIT":

            return {

                ...state,

                isEditingName: false,

            };

        case "RESET_MODAL":

            return {
                ...state,

                isModalOpen: false,

                modalValue: "",

                addEditorError: "",

                changeNameError: "",
            };

        case "RESET":
            return {
                ...initialState,
                nameInputRef: state.nameInputRef,
                modalInputRef: state.modalInputRef,
            };

        default:
            return state;
    }

}