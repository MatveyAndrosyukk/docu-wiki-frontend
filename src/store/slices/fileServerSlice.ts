import {ServerFile} from "../types/ServerFile";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {fetchFilesByEmail} from "../thunks/files/fetchFilesByEmail";
import {createFile} from "../thunks/files/createFile";
import {findFileById} from "../utils/fileTreeActionUtils";
import {FileType} from "../../types/file";

interface FileServerState {
    files: ServerFile[];
    loading: boolean;
}

const initialState: FileServerState = {
    files: [],
    loading: false,
};

const fileServerSlice = createSlice({
    name: "fileServer",
    initialState,
    reducers: {
        clearServerFiles() {
            return initialState;
        },
        addTempRootFolder(
            state,
            action: PayloadAction<{ tempId: number, name: string, authorEmail: string}>
        ) {
            const { tempId, name, authorEmail } = action.payload;
            const tempRoot: ServerFile = {
                id: tempId,
                name,
                type: FileType.Folder,
                parent: null,
                children: [],
                author: { email: authorEmail },
            };

            state.files.push(tempRoot);
        },
        toggleFileLikeOptimistic(state, action: PayloadAction<{ fileId: number }>) {
            const file = findFileById(state.files, action.payload.fileId);
            if (!file) return;

            if (file.isLiked) {
                file.isLiked = false;
                file.likes = Math.max((file.likes ?? 1) - 1, 0);
            } else {
                file.isLiked = true;
                file.likes = (file.likes ?? 0) + 1;
            }
        },
        revertFileLike(
            state,
            action: PayloadAction<{
                fileId: number;
                prevIsLiked: boolean;
                prevLikes: number;
            }>
        ) {
            const file = findFileById(state.files, action.payload.fileId);
            if (!file) return;

            file.isLiked = action.payload.prevIsLiked;
            file.likes = action.payload.prevLikes;
        },
        optimisticUpdateFileContent(
            state,
            action: PayloadAction<{
                fileId: number;
                newContent: string;
                editor: string;
            }>
        ) {
            const file = findFileById(state.files, action.payload.fileId);
            if (!file) return;

            file.content = action.payload.newContent;
            file.lastEditor = action.payload.editor;
        },
        revertFileContent(
            state,
            action: PayloadAction<{
                fileId: number;
                prevContent: string;
                prevLastEditor?: string | null;
            }>
        ) {
            const file = findFileById(state.files, action.payload.fileId);
            if (!file) return;

            file.content = action.payload.prevContent;
            file.lastEditor = action.payload.prevLastEditor ?? file.lastEditor;
        },
        optimisticUpdateFileName(
            state,
            action: PayloadAction<{
                fileId: number;
                newName: string;
            }>
        ) {
            const file = findFileById(state.files, action.payload.fileId);
            if (!file) return;

            file.name = action.payload.newName;
        },
        revertFileName(
            state,
            action: PayloadAction<{
                fileId: number;
                prevName: string;
            }>
        ) {
            const file = findFileById(state.files, action.payload.fileId);
            if (!file) return;

            file.name = action.payload.prevName;
        },
        removeFileOptimistic(state, action: PayloadAction<number>) {
            const id = action.payload;

            const remove = (nodes: ServerFile[]): ServerFile[] =>
                nodes
                    .filter(n => n.id !== id)
                    .map(n => ({
                        ...n,
                        children: n.children ? remove(n.children) : [],
                    }));

            state.files = remove(state.files);
        },
        restoreFile(state, action: PayloadAction<ServerFile>) {
            const file = action.payload;

            if (!file.parent) {
                state.files.push(file);
                return;
            }

            const addToParent = (nodes: ServerFile[]): boolean => {
                for (const node of nodes) {
                    if (node.id === file.parent) {
                        node.children = node.children ?? [];
                        node.children.push(file);
                        return true;
                    }
                    if (node.children && addToParent(node.children)) return true;
                }
                return false;
            };

            addToParent(state.files);
        },
    },
    extraReducers: builder => {
        builder
            .addCase(fetchFilesByEmail.pending, state => {
                state.loading = true;
            })
            .addCase(fetchFilesByEmail.fulfilled, (state, action) => {
                console.log('FILES FETCHED')
                state.files = action.payload;
                state.loading = false;
            })
            .addCase(fetchFilesByEmail.rejected, state => {
                state.files = [];
                state.loading = false;
            })
            .addCase(createFile.fulfilled, (state, action) => {
                const serverFile = action.payload;
                const parentId = typeof serverFile.parent === "number" ? serverFile.parent : null;

                const addToParent = (nodes: ServerFile[]): boolean => {
                    for (const node of nodes) {
                        if (node.id === parentId) {
                            node.children = node.children ?? [];
                            node.children.push(serverFile);
                            return true;
                        }
                        if (node.children && addToParent(node.children)) return true;
                    }
                    return false;
                };

                if (parentId === null) {
                    state.files.push(serverFile);
                    return;
                }

                addToParent(state.files);
            });
    },
});

export const {
    clearServerFiles,
    toggleFileLikeOptimistic,
    revertFileLike,
    optimisticUpdateFileContent,
    revertFileContent,
    optimisticUpdateFileName,
    revertFileName,
    removeFileOptimistic,
    restoreFile,
    addTempRootFolder,
} = fileServerSlice.actions;
export default fileServerSlice.reducer;