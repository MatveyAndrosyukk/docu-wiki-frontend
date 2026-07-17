import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {selectFileTree} from "./selectFileTree";
import {findFileById} from "../utils/file.utils";

export const selectOpenedFile = createSelector(
    [
        (state: RootState) => state.fileUi.openedFileId,
        (state: RootState) => state.fileServer.files,
        (state: RootState) => state.fileUi.openedFolders,
        (state: RootState) => state.fileUi.pendingFiles,
        (state: RootState) => state.fileUi.pendingRootFolders,
    ],
    (
        openedFileId,
        serverFiles,
        openedFolders,
        pendingFiles,
        pendingRootFolders
    ) => {

        if (openedFileId === null) return null;

        const tree = selectFileTree.resultFunc(
            serverFiles,
            openedFolders,
            pendingFiles,
            pendingRootFolders
        );

        return findFileById(
            tree,
            openedFileId
        );
    }
);