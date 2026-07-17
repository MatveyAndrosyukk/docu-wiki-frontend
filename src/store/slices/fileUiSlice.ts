import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {createFile} from "../thunks/files/createFile";
import {
    findFileById,
    findPathToFile,
    getAllChildFolderIdsUi,
    openFoldersOnPathPreserveOthers
} from "../utils/file.utils";
import {FileType} from "../../types/file";
import {PendingImage} from "../types/PendingImage";
import {UiFile} from "../types/UiFile";

interface FileUiState {

    openedFolders: number[];

    openedFileId: number | null;

    isSaving: boolean;

    pendingFiles: Record<
        number,
        {
            parentId: number | null;
            name: string;
        }
    >;

    pendingRootFolders: Record<
        number,
        {
            name: string;
        }
    >;

    pendingImages: Record<
        string,
        PendingImage
    >;
}

const initialState: FileUiState = {
    openedFolders: [],

    openedFileId: null,

    isSaving: false,

    pendingFiles: {},

    pendingRootFolders: {},

    pendingImages: {},
};

const fileUiSlice = createSlice(
    {
        name: "fileUi",
        initialState,
        reducers: {
            toggleFolder(
                state,
                action: PayloadAction<
                    {
                        id: number;
                        tree: UiFile[];
                    }
                >
            ) {

                const {
                    id,
                    tree
                } = action.payload;

                if (state.openedFolders.includes(
                    id
                )) {

                    const findNode = (
                        nodes: UiFile[]
                    ): UiFile | null => {

                        for (const node of nodes) {

                            if (node.id === id) return node;

                            const found = findNode(
                                node.children
                            );

                            if (found) return found;
                        }

                        return null;
                    };

                    const node = findNode(
                        tree
                    );

                    if (node) {

                        const childFolderIds = getAllChildFolderIdsUi(
                            node
                        );

                        state.openedFolders = state.openedFolders.filter(
                            folderId => folderId !== id &&
                                !childFolderIds.includes(
                                    folderId
                                )
                        );
                    } else {

                        state.openedFolders = state.openedFolders.filter(
                            folderId => folderId !== id
                        );
                    }
                } else {

                    state.openedFolders.push(
                        id
                    );
                }
            },

            openFile(
                state,
                action: PayloadAction<
                    number | null
                >
            ) {

                state.openedFileId = action.payload;
            },

            addPendingFile(
                state,
                action: PayloadAction<
                    {
                        tempId: number;
                        parentId: number | null;
                        name: string
                    }
                >
            ) {

                state.pendingFiles[action.payload.tempId] = {
                    parentId: action.payload.parentId,
                    name: action.payload.name,
                };
            },

            clearUiState() {
                return initialState;
            },

            openFolder(
                state,
                action: PayloadAction<number>
            ) {

                const id = action.payload;

                if (!state.openedFolders.includes(
                    id
                )) {

                    state.openedFolders.push(
                        id
                    );
                }
            },

            openPathToNode(
                state,
                action: PayloadAction<
                    {
                        id: number;
                        files: any[];
                    }
                >
            ) {

                const targetId = action.payload.id;

                const files = action.payload.files;

                const path = findPathToFile(
                    files,
                    targetId
                );

                if (!path) return;

                const targetNode = findFileById(
                    files,
                    targetId
                );

                if (!targetNode) return;

                if (targetNode.type === FileType.File) {

                    state.openedFileId = targetId;

                    state.openedFolders = openFoldersOnPathPreserveOthers(
                        state.openedFolders,
                        path
                    );

                } else if (targetNode.type === FileType.Folder) {

                    state.openedFolders = openFoldersOnPathPreserveOthers(
                        state.openedFolders,
                        path
                    );
                }
            },

            addPendingImage(
                state,
                action: PayloadAction<
                    {
                        fileId: number | undefined;
                        imageName: string
                    }
                >
            ) {

                state.pendingImages[action.payload.imageName] = {
                    status: 'pending',
                };
            },

            markImageError(
                state,
                action: PayloadAction<string>
            ) {

                if (state.pendingImages[action.payload]) {

                    state.pendingImages[action.payload].status = 'error';
                }
            },

            removePendingImage(
                state,
                action: PayloadAction<string>
            ) {

                delete state.pendingImages[action.payload];
            },

            setSaving(
                state,
                action: PayloadAction<boolean>
            ) {

                state.isSaving = action.payload;
            },

            addPendingRootFolder(
                state,
                action: PayloadAction<
                    {
                        tempId: number;
                        name: string;
                    }
                >
            ) {

                state.pendingRootFolders[action.payload.tempId] = {
                    name: action.payload.name,
                };
            }
        },

        extraReducers: builder => {
            builder
                .addCase(
                    createFile.fulfilled,
                    (
                        state,
                        action
                    ) => {

                        const tempId = action.meta.arg.tempId;

                        if (tempId &&
                            state.pendingFiles[tempId] !== undefined) {

                            delete state.pendingFiles[tempId];
                        } else if (tempId &&
                            state.pendingRootFolders[tempId] !== undefined) {

                            delete state.pendingRootFolders[tempId];
                        }
                    }
                )
                .addCase(
                    createFile.rejected,
                    (
                        state,
                        action
                    ) => {

                        const tempId = action.meta.arg.tempId;

                        if (tempId &&
                            state.pendingFiles[tempId] !== undefined) {

                            delete state.pendingFiles[tempId];

                        } else if (tempId &&
                            state.pendingRootFolders[tempId] !== undefined) {

                            delete state.pendingRootFolders[tempId];
                        }
                    }
                );
        }
    }
);

export const {
    toggleFolder,
    openFile,
    addPendingFile,
    clearUiState,
    openPathToNode,
    addPendingImage,
    markImageError,
    removePendingImage,
    setSaving,
    addPendingRootFolder,
    openFolder
} = fileUiSlice.actions;

export default fileUiSlice.reducer;