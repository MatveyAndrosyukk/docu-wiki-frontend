import {File, FileStatus, FileType} from "../../types/file";
import {UiFile} from "../types/UiFile";

interface TreeNodeBase {
    id: number;
    children?: TreeNodeBase[];
}

export const updateLikesInTree = (
    files: File[],
    targetId: number,
    newLikesDelta: number,
    newIsLiked: boolean
): File[] => {
    return files.map(file => {
        if (file.id === targetId && file.type === FileType.File) {
            return {
                ...file,
                likes: (file.likes || 0) + newLikesDelta,
                isLiked: newIsLiked
            };
        }
        if (file.children?.length) {
            return {
                ...file,
                children: updateLikesInTree(file.children, targetId, newLikesDelta, newIsLiked)
            };
        }
        return file;
    });
};

export function deepCloneWithNewIds(file: File): File {
    const newId = Date.now() + Math.floor(Math.random() * 1000000);
    return {
        ...file,
        id: newId,
        children: file.children
            ? file.children.map(child => deepCloneWithNewIds(child))
            : [],
    };
}

export function closeAllFiles(nodes: File[]): File[] {
    return nodes.map(node => {
        const newNode = {...node};
        if (newNode.type === FileType.File) {
            newNode.status = FileStatus.Closed;
        }
        if (newNode.children) {
            newNode.children = closeAllFiles(newNode.children);
        }
        return newNode;
    });
}

export function closeAllChildren(nodes: File[]): File[] {
    return nodes.map(node => ({
        ...node,
        status: node.type === FileType.Folder ? FileStatus.Closed : node.status,
        children: node.children ? closeAllChildren(node.children) : [],
    }));
}

export function deleteById(
    nodes: File[],
    id: number | null
): File[] {
    return nodes
        .filter(node => node.id !== id)
        .map(node => ({
            ...node,
            children: node.children ? deleteById(node.children, id) : [],
        }));
}

export function closeAllFilesExcept(
    nodes: File[],
    openedFileId: number | null
): File[] {
    return nodes.map(node => {
        const newNode = {...node};
        if (newNode.type === FileType.File) {
            newNode.status = newNode.id === openedFileId ? FileStatus.Opened : FileStatus.Closed;
        }
        if (newNode.children && newNode.children.length > 0) {
            newNode.children = closeAllFilesExcept(newNode.children, openedFileId);
        }
        return newNode;
    });
}

export const getAllChildFolderIdsUi = (node: UiFile): number[] => {
    let ids: number[] = [];
    for (const child of node.children) {
        if (child.type === FileType.Folder) {
            ids.push(child.id);
            ids = ids.concat(getAllChildFolderIdsUi(child));
        }
    }
    return ids;
};

export function findFileById<T extends TreeNodeBase>(
    files: T[],
    id: number
): T | null {
    for (const file of files) {
        if (file.id === id) return file;
        if (file.children) {
            const found = findFileById(file.children as T[], id);
            if (found) return found;
        }
    }
    return null;
}

export function findPathToFile(files: File[], targetId: number): number[] | null {
    for (const file of files) {
        if (file.id === targetId) return [file.id];
        if (file.children) {
            const childPath = findPathToFile(file.children, targetId);
            if (childPath) return [file.id, ...childPath];
        }
    }
    return null;
}

export function openFoldersOnPathPreserveOthers(openedFolders: number[], path: number[]): number[] {
    const newOpened = [...openedFolders];
    for (const id of path) {
        if (!newOpened.includes(id)) newOpened.push(id);
    }
    return newOpened;
}