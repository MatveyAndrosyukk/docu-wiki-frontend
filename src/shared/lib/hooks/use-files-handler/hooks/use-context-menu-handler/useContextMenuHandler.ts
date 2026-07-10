import React, {useCallback, useReducer, useRef,} from "react";
import {useSelector} from "react-redux";

import {UiFile} from "../../../../../../store/types/UiFile";
import {RootState} from "../../../../../../store";
import {selectFileTree} from "../../../../../../store/selectors/selectFileTree";

import {pasteFileCase} from "../use-file-actions-hanler/functions/cases/pasteFileCase";

import {checkNameConflictInFolder} from "../../../../utils/modalUtils";

import {User} from "../../../../../../store/slices/userSlice";

import {ContextMenuHandlerState, initialState,} from "./context-menu.types";

import {contextMenuReducer,} from "./context-menu.reducer";
import {
    ActionModalState,
    ActionType,
    FileActionsHandlerContext
} from "../use-file-actions-hanler/file-actions-handler.types";

interface Params {

    openModal: (
        openState: ActionModalState,
        value?: string
    ) => void;

    openDeleteModal: (
        file: UiFile,
        user: User | null
    ) => void;

    actionContext: FileActionsHandlerContext;

}

export default function useContextMenuHandler(
    {
        openModal,
        openDeleteModal,
        actionContext,
    }: Params
): ContextMenuHandlerState {

    const menuRef =
        useRef<HTMLUListElement>(null);

    const [state, dispatch] = useReducer(
        contextMenuReducer,
        {
            ...initialState,
            menuRef,
        }
    );

    const viewedUser = useSelector(
        (state: RootState) =>
            state.user.viewedUser
    );

    const files =
        useSelector(selectFileTree);

    const getAdjustedX = useCallback(
        (
            clientX: number
        ) => {

            const width =
                window.innerWidth;

            if (width < 420) {

                return clientX - width * 0.15;

            }

            if (width < 700) {

                return clientX - width * 0.25;

            }

            if (width < 1270) {

                return clientX - width * 0.35;

            }

            return clientX;

        },
        []
    );

    const open = useCallback(
        (
            event: React.MouseEvent | {
                clientX: number;
                clientY: number;
                preventDefault?: () => void;
            },
            file: UiFile
        ) => {

            if ("preventDefault" in event) {

                event.preventDefault?.();

            }

            dispatch({

                type: "OPEN",

                payload: {

                    x: getAdjustedX(
                        event.clientX
                    ),

                    y: event.clientY,

                    file,

                },

            });

        },
        [
            getAdjustedX,
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

    const setCopiedFile = useCallback(
        (
            file: UiFile | null
        ) => {

            dispatch({

                type: "SET_COPIED_FILE",

                payload: file,

            });

        },
        []
    );

    const copy = useCallback(
        (
            file: UiFile
        ) => {

            setCopiedFile(file);

        },
        [
            setCopiedFile,
        ]
    );

    const paste = useCallback(
        (
            parentId: number | null
        ) => {

            if (
                !state.copiedFile ||
                parentId === null
            ) {

                return;

            }

            const hasConflict =
                checkNameConflictInFolder(
                    files,
                    parentId,
                    state.copiedFile.name
                );

            if (hasConflict) {

                openModal(
                    {
                        reason: ActionType.PasteFile,
                        id: parentId,
                        title: "Paste file",
                    },
                    state.copiedFile.name
                );

                return;

            }

            pasteFileCase({

                context: actionContext,

                parentId,

                title: state.copiedFile.name,

                copiedFile: state.copiedFile,

            });

        },
        [
            state.copiedFile,
            files,
            actionContext,
            openModal,
        ]
    );

    const addRootFolder = useCallback(
        () => {

            openModal(
                {
                    reason: ActionType.AddRootFolder,

                    id: 0,

                    title: "Add root folder",
                }
            );
        },
        [
            openModal
        ]
    )

    const addFile = useCallback(
        (
            parentId: number
        ) => {

            openModal(
                {

                    reason: ActionType.AddFile,

                    id: parentId,

                    title: "Add File",

                }
            );

        },
        [
            openModal,
        ]
    );

    const addFolder = useCallback(
        (
            parentId: number
        ) => {

            openModal({

                reason: ActionType.AddFolder,

                id: parentId,

                title: "Add Folder",

            });

        },
        [
            openModal,
        ]
    );

    const rename = useCallback(
        (
            file: UiFile
        ) => {

            openModal(
                {

                    reason: ActionType.RenameFile,

                    id: file.id,

                    title: "Rename file",

                },
                file.name
            );

        },
        [
            openModal,
        ]
    );

    const remove = useCallback(
        (
            file: UiFile
        ) => {

            openDeleteModal(
                file,
                viewedUser
            );

        },
        [
            openDeleteModal,
            viewedUser,
        ]
    );

    return {

        state,

        actions: {
            open,

            close,

            copy,

            setCopiedFile,

            paste,

            addFile,

            addFolder,

            addRootFolder,

            rename,

            remove,
        }

    };

}