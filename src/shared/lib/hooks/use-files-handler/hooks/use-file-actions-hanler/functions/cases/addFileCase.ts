import {FileType} from "../../../../../../../../types/file";

import {checkNameConflictInFolder, createFilePayload} from "../../../../../../utils/modalUtils";

import {createFile} from "../../../../../../../../store/thunks/files/createFile";

import {createOptimisticFile} from "../../utils/createOptimisticFile";
import {rollbackFilesCount} from "../../utils/rollbackFilesCount";
import {isFilesLimitExceeded} from "../../utils/isFilesLimitExceeded";
import {FileActionsHandlerContext} from "../../file-actions-handler.types";

interface Params {
    context: FileActionsHandlerContext;

    parentId: number;

    title: string;
}

export function addFileCase(
    {
        context,
        title,
        parentId
    }: Params
) {
    const {
        files,

        dispatch,

        viewedUserEmail,

        totalFiles,

        filesLimit,

        loggedInUser,

        premiumHandler,

        closeModal,

        setModalError,
    } = context;

    if (
        checkNameConflictInFolder(
            files,
            parentId,
            title
        )
    ) {

        setModalError(
            "File with this name exists"
        );

        return;
    }

    if (
        isFilesLimitExceeded(
            {
                loggedInUser,
                totalFiles,
                filesToAdd: 1,
                filesLimit,
            }
        )
    ) {

        closeModal();

        premiumHandler.setIsPremiumModalOpen(
            true
        );

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
            filesCountDelta: 1,
        }
    );

    closeModal();

    dispatch(
        createFile(
            {
                ...createFilePayload(
                    title,
                    FileType.File,
                    parentId,
                    viewedUserEmail
                ),
                tempId,
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
                        delta: 1,
                    }
                );
            }
        );
}