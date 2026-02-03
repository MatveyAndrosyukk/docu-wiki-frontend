import {File, FileStatus, FileType, TempFile} from "../../types/file";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchFilesByEmail} from "../thunks/files/fetchFilesByEmail";
import {createFile} from "../thunks/files/createFile";
import {deleteFileById} from "../thunks/files/deleteFileById";
import {updateFileContent} from "../thunks/files/updateFileContent";
import {
    closeAllChildren,
    closeAllFiles,
    closeAllFilesExcept,
    deleteById, extractOpenFolders, extractPendingFiles,
    findAndUpdate,
    findPathToNode, mergeFiles, normalizeParentId,
    openFoldersOnPathPreserveOthers, restoreOpenFolders,
    updateLikesInTree
} from "../utils/fileTreeActionUtils";
import {findNodeById} from "../../utils/functions/modalUtils";
import {updateFileName} from "../thunks/files/updateFileName";

interface FileTreeState {
    files: File[];
    pendingFiles: Record<number, number | null>
}

const initialState: FileTreeState = {
    files: [],
    pendingFiles: {},
}

interface ToggleLikeOptimisticPayload {
    fileId: number;
    isLiked: boolean | null | undefined;
}

const fileTreeSlice = createSlice({
    name: 'fileTree',
    initialState,
    reducers: {
        clearFiles(state) {
            state.files = [];
        },
        openFile(state, action: PayloadAction<{ id: number | null }>) {
            state.files = closeAllFiles(state.files);

            findAndUpdate(state.files, action.payload.id, (node) => {
                if (node.type === FileType.File) {
                    node.status = FileStatus.Opened;
                }
            })
        },
        toggleFolder(state, action: PayloadAction<{ id: number | null }>) {
            function toggle(nodes: File[]): File[] {
                return nodes.map(node => {
                    if (node.id === action.payload.id && node.type === FileType.Folder) {
                        const newStatus = node.status === FileStatus.Opened ? FileStatus.Closed : FileStatus.Opened;
                        return {
                            ...node,
                            status: newStatus,
                            children: newStatus === FileStatus.Closed ? closeAllChildren(node.children ?? []) : node.children ?? [],
                        };
                    }
                    if (node.children) {
                        return {
                            ...node,
                            children: toggle(node.children),
                        };
                    }
                    return node;
                });
            }

            state.files = toggle(state.files);
        },
        openPathToNode(state, action: PayloadAction<{ id: number }>) {
            const targetId = action.payload.id;

            const path = findPathToNode(state.files, targetId);
            if (!path) return;

            const targetNode = findNodeById(state.files, targetId);
            if (!targetNode) return;

            if (targetNode.type === FileType.File) {
                state.files = closeAllFilesExcept(state.files, targetId);
                state.files = openFoldersOnPathPreserveOthers(state.files, path);
            } else if (targetNode.type === FileType.Folder) {
                state.files = openFoldersOnPathPreserveOthers(state.files, path);
            }
        },
        resetFiles(state) {
            state.files = []
        },
        toggleFileLikeOptimistic(state, action: PayloadAction<ToggleLikeOptimisticPayload>) {
            const {fileId, isLiked} = action.payload;
            const newLikesDelta = isLiked ? -1 : +1;
            const newIsLiked = !isLiked;

            state.files = updateLikesInTree(state.files, fileId, newLikesDelta, newIsLiked);
        },
        revertFileLike(state, action: PayloadAction<ToggleLikeOptimisticPayload>) {
            const {fileId, isLiked} = action.payload;
            findAndUpdate(state.files, fileId, (node) => {
                if (node.type === FileType.File && node.likes !== null) {
                    node.likes += isLiked ? +1 : -1;
                    node.isLiked = !isLiked;
                }
            });
        },
        addTempFile(state, action: PayloadAction<TempFile>) {
            const tempFile = action.payload;

            findAndUpdate(state.files, tempFile.parent, (node) => {
                if (node.type === FileType.Folder) {
                    node.children = node.children
                        ? [...node.children, tempFile as unknown as File]
                        : [tempFile as unknown as File];

                    node.status = FileStatus.Opened;
                }
            });
        },
        registerPendingFile(
            state,
            action: PayloadAction<{ tempId: number; parentId: number | null }>
        ) {
            state.pendingFiles[action.payload.tempId] = action.payload.parentId;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilesByEmail.fulfilled, (state, action) => {
                const pendingFiles = extractPendingFiles(state.files);
                const openFolders = extractOpenFolders(state.files);

                let merged = mergeFiles(action.payload, pendingFiles);
                merged = restoreOpenFolders(merged, openFolders);

                state.files = merged;
            })
            .addCase(fetchFilesByEmail.rejected, (state) => {
                state.files = []
            })
            .addCase(createFile.fulfilled, (state, action) => {
                const realFile = action.payload;
                const parentId = normalizeParentId(realFile.parent);

                const tempId = Object.entries(state.pendingFiles)
                    .find(([, pId]) => pId === parentId)?.[0];

                if (tempId) {
                    state.files = deleteById(state.files, Number(tempId));
                    delete state.pendingFiles[Number(tempId)];
                }

                findAndUpdate(state.files, parentId, node => {
                    if (node.type === FileType.Folder) {
                        node.children?.push(realFile);
                    }
                });
            })
            .addCase(createFile.rejected, (state) => {
                const tempIds = Object.keys(state.pendingFiles);

                if (tempIds.length === 0) return;

                const lastTempId = Number(tempIds[tempIds.length - 1]);

                state.files = deleteById(state.files, lastTempId);
                delete state.pendingFiles[lastTempId];
            })
            .addCase(deleteFileById.fulfilled, (state, action) => {
                const deletedFileId = action.payload;
                state.files = deleteById(state.files, deletedFileId);
            })
            .addCase(updateFileContent.fulfilled, (state, action) => {
                const changedFile = action.payload;

                function update(nodes: File[]) {
                    for (const node of nodes) {
                        if (node.id === changedFile.id && node.type === FileType.File) {
                            node.content = changedFile.content;
                            node.lastEditor = changedFile.lastEditor;
                            return true;
                        }
                        if (node.children && node.children.length > 0) {
                            if (update(node.children)) return true;
                        }
                    }
                    return false;
                }

                update(state.files);
            })
            .addCase(updateFileName.fulfilled, (state, action) => {
                const renamedFile = action.payload;

                findAndUpdate(state.files, renamedFile.id, (node) => {
                    node.name = renamedFile.name;
                })
            })
    }

});

export const {
    openFile,
    toggleFolder,
    openPathToNode,
    resetFiles,
    clearFiles,
    toggleFileLikeOptimistic,
    revertFileLike,
    addTempFile,
    registerPendingFile,
} = fileTreeSlice.actions;
export default fileTreeSlice.reducer;

