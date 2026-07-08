import {UiFile} from "../../../../../store/types/UiFile";
import {ModalActionContext} from "../types/ModalActionContext";
import {addRootFolderCase} from "../cases/addRootFolderCase";
import {addFolderCase} from "../cases/addFolderCase";
import {addFileCase} from "../cases/addFileCase";
import {renameFileCase} from "../cases/renameFileCase";
import {pasteFileCase} from "../cases/pasteFileCase";
import {OpenModalState} from "../types/OpenModalState";
import {ActionType} from "../types/ActionType";

interface ConfirmModalActionParams {
    modalState: OpenModalState & {
        title: string;
    };
    copiedFile: UiFile | null;
    context: ModalActionContext;
}

export function confirmModalAction(
    {
        modalState,
        copiedFile,
        context,
    }: ConfirmModalActionParams
) {

    const {
        reason,
        id,
        title,
    } = modalState;

    const trimmedTitle =
        title.trim();

    if (!trimmedTitle) {
        return;
    }

    switch (reason) {

        case ActionType.AddRootFolder:
            return addRootFolderCase({
                context,
                title: trimmedTitle,
            });

        case ActionType.AddFolder:
            return addFolderCase({
                context,
                parentId: id as number,
                title: trimmedTitle,
            });

        case ActionType.AddFile:
            return addFileCase({
                context,
                parentId: id as number,
                title: trimmedTitle,
            });

        case ActionType.RenameFile:
            return renameFileCase({
                context,
                fileId: id as number,
                title: trimmedTitle,
            });

        case ActionType.PasteFile:

            if (!copiedFile) {
                return;
            }

            return pasteFileCase({
                context,
                parentId: id as number,
                title: trimmedTitle,
                copiedFile,
            });

        default:
            return;
    }
}