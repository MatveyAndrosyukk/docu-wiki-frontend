import {createSelector} from "@reduxjs/toolkit";
import {RootState} from "../index";
import {UiFile} from "../types/UiFile";
import {ServerFile} from "../types/ServerFile";
import {FileStatus, FileType} from "../../types/file";

export const selectFileTree = createSelector(
    [
        (state: RootState) => state.fileServer.files,
        (state: RootState) => state.fileUi.openedFolders,
        (state: RootState) => state.fileUi.pendingFiles,
        (state: RootState) => state.fileUi.pendingRootFolders,
    ],
    (serverFiles, openedFolders, pendingFiles, pendingRootFolders): UiFile[] => {
        const openedSet = new Set(openedFolders);

        const build = (nodes: ServerFile[]): UiFile[] =>
            nodes.map(node => {
                const children = node.children ? build(node.children) : [];

                return {
                    id: node.id,
                    name: node.name,
                    type: node.type,
                    parent: node.parent,
                    author: node.author,
                    content: node.content,
                    likes: node.likes,
                    isLiked: node.isLiked,
                    lastEditor: node.lastEditor,
                    children,
                    status: openedSet.has(node.id)
                        ? FileStatus.Opened
                        : FileStatus.Closed,
                    isPending: false,
                };
            }).sort((a,b) => a.name.localeCompare(b.name));

        const tree = build(serverFiles);


        Object.entries(pendingFiles).forEach(([tempId, parentId]) => {
            if (parentId === null) return;

            const insert = (nodes: UiFile[]): boolean => {
                for (const node of nodes) {
                    if (node.id === parentId) {
                        node.children.push({
                            id: Number(tempId),
                            name: "Создание файла…",
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

        Object.keys(pendingRootFolders).forEach(tempIdStr => {
            const tempId = Number(tempIdStr);
            tree.push({
                id: tempId,
                name: "Создание папки…",
                type: FileType.Folder,
                parent: null,
                children: [],
                status: FileStatus.Closed,
                isPending: true,
            });
        });

        const sortTree = (nodes: UiFile[]): UiFile[] => {
            return nodes
                .sort((a, b) => a.name.localeCompare(b.name))
                .map(node => ({
                    ...node,
                    children: sortTree(node.children || [])
                }));
        };

        return sortTree(tree);
    }
);