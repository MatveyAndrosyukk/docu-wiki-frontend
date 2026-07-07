import {FileType} from "../../../../../../../types/file";

import {checkNameConflictInFolder, createFilePayload} from "../../../../../../lib/utils/modalUtils";

import {createFile} from "../../../../../../../store/thunks/files/createFile";

import {createOptimisticFile} from "../utils/createOptimisticFile";
import {rollbackFilesCount} from "../utils/rollbackFilesCount";
import {isFilesLimitExceeded} from "../utils/isFilesLimitExceeded";
import {ModalActionContext} from "../types/ModalActionContext";

interface AddFileCaseParams {
    context: ModalActionContext;
    parentId: number;
    title: string;
}

export function addFileCase(
    {
        context,
        title,
        parentId
    }: AddFileCaseParams
) {
    const {
        files,
        dispatch,
        viewedUserEmail,
        totalFiles,
        filesLimit,
        loggedInUser,
        premiumState,
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
        isFilesLimitExceeded({
            loggedInUser,
            totalFiles,
            filesToAdd: 1,
            filesLimit,
        })
    ) {
        closeModal();

        premiumState.setIsPremiumModalOpen(
            true
        );

        return;
    }

    const tempId =
        Date.now();

    createOptimisticFile({
        dispatch,
        parentId,
        tempId,
        name: title,
        viewedUserEmail,
        filesCountDelta: 1,
    });

    closeModal();

    dispatch(
        createFile({
            ...createFilePayload(
                title,
                FileType.File,
                parentId,
                viewedUserEmail
            ),
            tempId,
        })
    )
        .unwrap()
        .catch(() => {
            rollbackFilesCount({
                dispatch,
                viewedUserEmail,
                delta: 1,
            });
        });
}