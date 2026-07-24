import {UiFile} from "../../../../../../../../store/types/UiFile";
import {FileType} from "../../../../../../../../types/file";

import {checkNameConflictInFolder} from "../../../../../../utils/modalUtils";

import {createFile} from "../../../../../../../../store/thunks/files/createFile";

import {createOptimisticFile} from "../../utils/createOptimisticFile";
import {rollbackFilesCount} from "../../utils/rollbackFilesCount";
import {isFilesLimitExceeded} from "../../utils/isFilesLimitExceeded";
import {getFilesCountToAdd} from "../../utils/getFilesCountToAdd";
import {FileActionsHandlerContext} from "../../file-actions-handler.types";

interface Params {
    context: FileActionsHandlerContext;

    parentId: number;

    title: string;

    copiedFile: UiFile;
}

export function pasteFileCase(
    {
        context,
        parentId,
        title,
        copiedFile,
    }: Params
) {

    const {
        files,

        setModalError,

        viewedUser,

        totalFiles,

        filesLimit,

        closeModal,

        premiumHandler,

        dispatch,

        viewedUserEmail
    } = context;
    if (
        checkNameConflictInFolder(
            files,
            parentId,
            title
        )
    ) {

        const typeLabel =
            copiedFile?.type === FileType.File
                ? "File"
                : "Folder";

        setModalError(
            `${typeLabel} with this name exists`
        );

        return;
    }

    const filesToAdd = getFilesCountToAdd(
        copiedFile
    );

    if (
        isFilesLimitExceeded(
            {
                viewedUser,
                totalFiles,
                filesToAdd,
                filesLimit,
            }
        )
    ) {

        closeModal();

        premiumHandler.setIsPremiumModalOpen(true);

        return;
    }

    const tempId = Date.now();

    createOptimisticFile(
        {
            dispatch,
            parentId,
            tempId,
            name: title,
            viewedUserEmail,
            filesCountDelta: filesToAdd,
        }
    );

    closeModal();

    dispatch(
        createFile(
            {
                ...copiedFile,
                name: title,
                parent: parentId,
                tempId,
                targetUserEmail:
                viewedUserEmail,
            }
        )
    )
        .unwrap()
        .catch(
            () => {

                rollbackFilesCount(
                    {
                        dispatch,
                        viewedUserEmail,
                        delta: filesToAdd,
                    }
                );

            }
        );
}