import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../index";
import { UiFile } from "../types/UiFile";
import { ServerFile } from "../types/ServerFile";
import { FileStatus, FileType } from "../../types/file";

const compareNodes = (a: UiFile, b: UiFile) => {
    if (a.type !== b.type) {
        if (a.type === FileType.Folder) return -1;
        if (b.type === FileType.Folder) return 1;
    }

    return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
};

const sortTree = (nodes: UiFile[]): UiFile[] => {
    nodes.sort(compareNodes);
    nodes.forEach(node => {
        if (node.children?.length) {
            sortTree(node.children);
        }
    });
    return nodes;
};

export const selectFileTree = createSelector(
    [
        (state: RootState) => state.fileServer.files,
        (state: RootState) => state.fileUi.openedFolders,
        (state: RootState) => state.fileUi.pendingFiles,
        (state: RootState) => state.fileUi.pendingRootFolders,
    ],
    (
        serverFiles,
        openedFolders,
        pendingFiles,
        pendingRootFolders
    ): UiFile[] => {
        const openedSet = new Set(openedFolders);

        const build = (nodes: ServerFile[]): UiFile[] =>
            nodes.map(node => ({
                id: node.id,
                name: node.name,
                type: node.type,
                parent: node.parent,
                author: node.author,
                content: node.content,
                likes: node.likes,
                isLiked: node.isLiked,
                lastEditor: node.lastEditor,
                children: node.children ? build(node.children) : [],
                status: openedSet.has(node.id)
                    ? FileStatus.Opened
                    : FileStatus.Closed,
                isPending: false,
            }));

        const tree = build(serverFiles);

        Object.entries(pendingFiles).forEach(([tempId, pending]) => {
            const { parentId, name } = pending;
            if (parentId === null) return;

            const insert = (nodes: UiFile[]): boolean => {
                for (const node of nodes) {
                    if (node.id === parentId) {
                        node.children.push({
                            id: Number(tempId),
                            name,
                            type: FileType.File,
                            parent: parentId,
                            children: [],
                            status: FileStatus.Closed,
                            isPending: true,
                        });
                        return true;
                    }

                    if (insert(node.children)) return true;
                }
                return false;
            };

            insert(tree);
        });

        Object.entries(pendingRootFolders).forEach(([tempIdStr, pending]) => {
            tree.push({
                id: Number(tempIdStr),
                name: pending.name,
                type: FileType.Folder,
                parent: null,
                children: [],
                status: FileStatus.Closed,
                isPending: true,
            });
        });

        return sortTree(tree);
    }
);