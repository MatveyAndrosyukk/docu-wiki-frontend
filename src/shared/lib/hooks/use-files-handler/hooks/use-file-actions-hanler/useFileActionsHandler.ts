import {useCallback, useMemo, useReducer, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";

import {AppDispatch, RootState} from "../../../../../../store";
import {selectFileTree} from "../../../../../../store/selectors/selectFileTree";

import {PremiumState} from "../../../../../ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";

import {getModalInitialValue} from "./utils/getModalInitialValue";

import {useModalFocusEffect} from "./hooks/useModalFocusEffect";
import {usePendingPasteEffect} from "./hooks/usePendingPasteEffect";
import {usePasteNameValidation} from "./hooks/usePasteNameValidation";
import {useNameLengthValidation} from "./hooks/useNameLengthValidation";

import {confirmModalAction} from "./functions/confirmModalAction";

import {
    ActionModalState,
    FileActionsHandlerContext,
    FileActionsHandlerStateActions,
    initialState,
} from "./file-actions-handler.types";
import useContextMenuHandler from "../use-context-menu-handler/useContextMenuHandler";
import {fileActionsHandlerReducer} from "./file-actions-handler.reducer";
import {filesLimit} from "./file-actions-handler.constants";

interface Props {
    premiumHandler: PremiumState,
    openDeleteModal: any,
}

export default function useFileActionsHandler(
    {
        premiumHandler,
        openDeleteModal,
    }: Props
): FileActionsHandlerStateActions {

    const inputRef =
        useRef<HTMLInputElement>(null);

    const [
        state,
        dispatch
    ] = useReducer(
        fileActionsHandlerReducer,
        {
            ...initialState,
            inputRef,
        }
    );

    const reduxDispatch =
        useDispatch<AppDispatch>();

    const files =
        useSelector(selectFileTree);

    const {
        viewedUser,
        loggedInUser,
        totalFiles,
    } = useSelector(
        (state: RootState) => ({
            viewedUser: state.user.viewedUser,
            loggedInUser: state.user.loggedInUser,
            totalFiles:
                state.user.viewedUser?.amountOfFiles ?? 0,
        })
    );

    const open = useCallback(
        (
            openState: ActionModalState,
            value?: string
        ) => {


            dispatch({

                type: "OPEN",

                payload: openState,

            });


            dispatch({

                type: "SET_VALUE",

                payload:
                    value ??
                    getModalInitialValue(
                        files,
                        openState
                    ),

            });


        },
        [
            files,
        ]
    );

    const close = useCallback(
        () => {

            dispatch({

                type: "CLOSE",

            });

        },
        []
    );

    const setValue = useCallback(
        (
            value: string
        ) => {

            dispatch({

                type: "SET_VALUE",

                payload: value,

            });

        },
        []
    );

    const setError = useCallback(
        (
            value: string
        ) => {

            dispatch({

                type: "SET_ERROR",

                payload: value,

            });

        },
        []
    );

    const actionContext =
        useMemo<FileActionsHandlerContext>(
            () => ({
                files,
                dispatch: reduxDispatch,
                viewedUserEmail:
                    viewedUser?.email ?? "unknown",
                loggedInUserEmail:
                    loggedInUser?.email ?? null,
                loggedInUser,
                totalFiles,
                filesLimit,
                premiumHandler,
                closeModal: close,
                setModalError: setError,
            }),
            [
                files,
                reduxDispatch,
                viewedUser?.email,
                loggedInUser,
                totalFiles,
                premiumHandler,
                close,
                setError,
            ]
        );

    const contextMenuHandler =
        useContextMenuHandler({
            openModal: open,
            openDeleteModal,
            actionContext,
        });

    const {
        copiedFile,
    } = contextMenuHandler.state;

    const confirm = useCallback(
        (
            modalState: ActionModalState & {
                title: string;
            }
        ) =>
            confirmModalAction({
                modalState,
                copiedFile,
                context: actionContext,
            }),
        [
            copiedFile,
            actionContext,
        ]
    );

    const clearPendingPaste = useCallback(
        () => {

            dispatch({

                type: "SET_PENDING_PASTE",

                payload: null,

            });

        },
        []
    );

    usePasteNameValidation({
        modalValue: state.value,
        modalOpenState: state.modalState,
        files,
        copiedFile,
        setModalError: setError,
    });

    usePendingPasteEffect({

        pendingPasteId:
        state.pendingPasteId,

        copiedFile,

        paste:
        contextMenuHandler.actions.paste,

        clearPendingPaste,

    });

    useModalFocusEffect(
        state.isOpen,
        inputRef
    );

    useNameLengthValidation({
        value: state.value,
        error: state.error,
        setError,
    });

    return {

        state,

        actions: {

            open,

            close,

            confirm,

            setValue,

            setError,

            clearPendingPaste,

        },

        contextMenuHandler,

    };
}