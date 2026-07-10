import {UiFile} from "../../../../../../../store/types/UiFile";
import {addRootFolderCase} from "./cases/addRootFolderCase";
import {addFolderCase} from "./cases/addFolderCase";
import {addFileCase} from "./cases/addFileCase";
import {renameFileCase} from "./cases/renameFileCase";
import {pasteFileCase} from "./cases/pasteFileCase";
import {ActionModalState, ActionType, FileActionsHandlerContext} from "../file-actions-handler.types";

interface Params {
    modalState: ActionModalState;

    copiedFile: UiFile | null;

    context: FileActionsHandlerContext;
}

export function confirmModalAction(
    {
        modalState,
        copiedFile,
        context,
    }: Params
) {

    const trimmedTitle = modalState.title.trim();

    if (!trimmedTitle) {

        return;
    }

    switch (modalState.reason) {

        case ActionType.AddRootFolder:

            return addRootFolderCase(
                {
                    context,
                    title: trimmedTitle,
                }
            );

        case ActionType.AddFolder:

            return addFolderCase(
                {
                    context,
                    parentId: modalState.id as number,
                    title: trimmedTitle,
                }
            );

        case ActionType.AddFile:

            return addFileCase(
                {
                    context,
                    parentId: modalState.id as number,
                    title: trimmedTitle,
                }
            );

        case ActionType.RenameFile:

            return renameFileCase(
                {
                    context,
                    fileId: modalState.id as number,
                    title: trimmedTitle,
                }
            );

        case ActionType.PasteFile:

            if (!copiedFile) {

                return;
            }

            return pasteFileCase(
                {
                    context,
                    parentId: modalState.id as number,
                    title: trimmedTitle,
                    copiedFile,
                }
            );

        default:
            return;
    }
}