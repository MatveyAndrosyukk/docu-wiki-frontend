import {useCallback, useState} from "react";
import {UiFile} from "../../../../store/types/UiFile";
import {OpenModalState} from "../../../lib/hooks/use-file-actions-modal-handler/types/OpenModalState";
import {ModalActionContext} from "../../../lib/hooks/use-file-actions-modal-handler/types/ModalActionContext";
import {useSelector} from "react-redux";
import {selectFileTree} from "../../../../store/selectors/selectFileTree";
import {checkNameConflictInFolder} from "../../../lib/utils/modalUtils";
import {ActionType} from "../../../lib/hooks/use-file-actions-modal-handler/types/ActionType";
import {pasteFileCase} from "../../../lib/hooks/use-file-actions-modal-handler/cases/pasteFileCase";
import {User} from "../../../../store/slices/userSlice";
import {RootState} from "../../../../store";

export interface ContextMenuFileActions {
    copiedFile: UiFile | null;
    setCopiedFile: (file: UiFile | null) => void;
    copy: (file: UiFile) => void;
    paste: (parentId: number | null) => void;
    addFile: (parentId: number) => void;
    addFolder: (parentId: number) => void;
    rename: (file: UiFile) => void;
    remove: (
        file: UiFile
    ) => void;
}

interface Params {
    openModal: (
        openState: OpenModalState,
        value?: string
    ) => void;

    openDeleteModal: (
        file: UiFile,
        user: User | null
    ) => void;

    actionContext: ModalActionContext;
}

export default function useContextMenuFileActions(
    {
        openModal,
        openDeleteModal,
        actionContext,
    }: Params): ContextMenuFileActions {
    const [copiedFile, setCopiedFile] = useState<UiFile | null>(null);

    const viewedUser = useSelector(
        (state: RootState) => state.user.viewedUser
    );

    const files = useSelector(selectFileTree);

    const copy = useCallback((file: UiFile) => {
        setCopiedFile(file);
    }, []);

    const paste = useCallback(
        (parentId: number | null) => {

            if (!copiedFile || parentId === null) {
                return;
            }

            const hasConflict = checkNameConflictInFolder(
                files,
                parentId,
                copiedFile.name
            );

            if (hasConflict) {
                openModal(
                    {
                        reason: ActionType.PasteFile,
                        id: parentId,
                        title: "Paste file",
                    },
                    copiedFile.name
                );

                return;
            }

            pasteFileCase({
                context: actionContext,
                parentId,
                title: copiedFile.name,
                copiedFile,
            });

        },
        [
            copiedFile,
            files,
            actionContext,
            openModal,
        ]
    );

    const addFile = useCallback((parentId: number) => {
        openModal({
            reason: ActionType.AddFile,
            id: parentId,
            title: "Add File",
        });
    }, [openModal]);

    const addFolder = useCallback((parentId: number) => {
        openModal({
            reason: ActionType.AddFolder,
            id: parentId,
            title: "Add Folder",
        });
    }, [openModal]);

    const rename = useCallback((file: UiFile) => {
        openModal(
            {
                reason: ActionType.RenameFile,
                id: file.id,
                title: "Rename file",
            },
            file.name
        );
    }, [openModal]);

    const remove = useCallback(
        (
            file: UiFile,
        ) => {
            openDeleteModal(file, viewedUser);
        },
        [openDeleteModal, viewedUser]
    );

    return {
        copiedFile,
        setCopiedFile,
        copy,
        paste,
        addFile,
        addFolder,
        rename,
        remove,
    };
}