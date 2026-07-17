import {useCallback, useReducer, useRef,} from "react";

import {useDispatch} from "react-redux";

import {AppDispatch} from "../../../../store";

import {User} from "../../../../store/slices/userSlice";

import {useAuthContext} from "../../../../context/auth-context/hooks/useAuthContext";

import {initialState, UserHandlerActionsState,} from "./user-handler.types";

import {userHandlerReducer,} from "./user-handler.reducer";

import useEditedNameValidation from "./effects/useEditedNameValidation";

import useEditedNameSync from "./effects/useEditedNameSync";

import useEditorsSync from "./effects/useEditorsSync";

import useNameInputFocus from "./effects/useNameInputFocus";

import {modalActions} from "./actions/modal.actions";

import {addEditorAction} from "./actions/add-editor.action";

import {deleteEditorAction} from "./actions/delete-editor.action";
import {changeUserName} from "../../../../store/thunks/user/changeUserName";

type Props = {

    user: User | null;

    openLoginModal(): void;

};

export default function useUserHandler(
    {

        user,

        openLoginModal,

    }: Props): UserHandlerActionsState {

    const reduxDispatch = useDispatch<AppDispatch>();

    const {

        authStatus,

    } = useAuthContext();

    const nameInputRef =
        useRef<HTMLInputElement>(null);

    const modalInputRef =
        useRef<HTMLInputElement>(null);

    const [state, dispatch] = useReducer(
        userHandlerReducer,

        {

            ...initialState,

            editedName: user?.name || "",

            editors: user?.whoCanEdit || [],

            nameInputRef,

            modalInputRef,

        }
    );

    const updateEditedName = useCallback(
        (value: string) => {

            dispatch({

                type: "SET_EDITED_NAME",

                payload: value,

            });

        },

        []
    );

    const updateModalValue = useCallback(
        (value: string) => {

            dispatch({

                type: "SET_MODAL_VALUE",

                payload: value,

            });

        },

        []
    );

    const startEditingName = useCallback(() => {

        dispatch({

            type: "SET_EDITING_NAME",

            payload: true,

        });

    }, []);

    const cancelEditingName = useCallback(() => {

        dispatch({

            type: "CANCEL_NAME_EDIT",

        });

        dispatch({

            type: "SET_EDITED_NAME",

            payload: user?.name || "",

        });

    }, [user?.name]);


    useEditedNameValidation({

        editedName: state.editedName,

        dispatch,

    });

    useEditedNameSync({

        user,

        dispatch,

    });

    useEditorsSync({

        modalValue: state.modalValue,

        user,

        dispatch,

    });

    useNameInputFocus({

        isEditingName: state.isEditingName,

        inputRef: nameInputRef,

    });

    const confirmNameEdition = useCallback(async () => {

            if (state.editedName === user?.name) {

                dispatch(
                    {
                        type: "SET_EDITING_NAME",
                        payload: false,
                    }
                );

                return;

            }

            dispatch(
                {
                    type: "SET_CHANGING_NAME",
                    payload: true,
                }
            );

            try {

                await reduxDispatch(
                    changeUserName(
                        {
                            name: state.editedName,
                            email: user?.email as string,
                        }
                    )
                ).unwrap();

                dispatch(
                    {
                        type: "SET_EDITING_NAME",
                        payload: false,
                    }
                );

                dispatch(
                    {
                        type: "SET_EDITED_NAME_ERROR",
                        payload: "",
                    }
                );

            } catch {

                dispatch(
                    {
                        type: "SET_EDITED_NAME_ERROR",
                        payload: "Username already exists",
                    }
                );

            } finally {

                dispatch(
                    {
                        type: "SET_CHANGING_NAME",
                        payload: false,
                    }
                );

            }

        },
        [
            reduxDispatch,
            state.editedName,
            user?.email,
            user?.name,
        ]
    );

    const keyDownWhileEditing = useCallback(
        async (
            e: React.KeyboardEvent<HTMLInputElement>
        ) => {

            if (e.key === "Enter") {

                if (state.editedNameError) {
                    return;
                }

                await confirmNameEdition();

            }

            if (e.key === "Escape") {

                cancelEditingName();

            }

        },

        [
            state.editedNameError,
            confirmNameEdition,
            cancelEditingName,
        ]
    );

    const blurNameAfterEdition = useCallback(
        () => {

            if (state.isChangingName) {
                return;
            }

            dispatch(
                {
                    type: "CANCEL_NAME_EDIT",
                }
            );

            dispatch(
                {
                    type: "SET_CHANGE_NAME_ERROR",
                    payload: "",
                }
            );

            dispatch(
                {
                    type: "SET_EDITED_NAME",
                    payload: user?.name || user?.email || "",
                }
            );

        },
        [
            state.isChangingName,
            user?.email,
            user?.name,
        ]
    );

    const {

        openModal,

        closeModal,

    } = modalActions({

        dispatch,

        authStatus,

        openLoginModal,

    });

    const addEditor = addEditorAction({

        dispatch,

        reduxDispatch,

    });

    const deleteEditor = deleteEditorAction({

        reduxDispatch,

    });

    return {

        state,

        actions: {
            startEditingName,
            cancelEditingName,
            updateEditedName,
            updateModalValue,
            confirmNameEdition,
            keyDownWhileEditing,
            blurNameAfterEdition,
            addEditor: () => addEditor(state.modalValue),
            deleteEditor,
            closeModal,
            openModal,
        }

    };

}