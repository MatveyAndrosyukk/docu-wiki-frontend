import {File, FileStatus, FileType} from "../../types/file";

export function findAndUpdate(
    nodes: File[],
    id: number | null,
    updater: (node: File, idx: number, arr: File[]) => boolean | void
): boolean {
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.id === id) {
            updater(node, i, nodes);
            return true;
        }
        if (node.children && node.children.length > 0) {
            if (findAndUpdate(node.children, id, updater)) return true;
        }
    }
    return false;
}

export const normalizeParentId = (
    parent: number | { id: number } | null
): number | null => {
    if (parent === null) return null;
    if (typeof parent === 'number') return parent;
    return parent.id;
};

export const extractPendingFiles = (files: File[]): File[] => {
    const result: File[] = [];

    const walk = (nodes: File[]) => {
        nodes.forEach(node => {
            if ((node as any).isPending) {
                result.push(node);
            }

            if (node.type === FileType.Folder && node.children) {
                walk(node.children);
            }
        });
    };

    walk(files);
    return result;
};

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

export function findPathToNode(
    nodes: File[],
    targetId: number,
    path: number[] | null = []
): number[] | null {
    for (const node of nodes) {
        // @ts-ignore
        const currentPath = [...path, node.id];
        if (node.id === targetId) {
            return currentPath;
        }
        if (node.children && node.children.length > 0) {
            const result = findPathToNode(node.children, targetId, currentPath);
            if (result) return result;
        }
    }
    return null;
}

export function openFoldersOnPathPreserveOthers(
    nodes: File[],
    pathIds: number[]
): File[] {
    return nodes.map(node => {
        const newNode = {...node};
        if (newNode.type === FileType.Folder) {
            if (pathIds.includes(newNode.id as number)) {
                newNode.status = FileStatus.Opened;
            }
            if (newNode.children && newNode.children.length > 0) {
                newNode.children = openFoldersOnPathPreserveOthers(newNode.children, pathIds);
            }
        }
        return newNode;
    });
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

const addFileToParent = (files: File[], parentId: number, file: File): boolean => {
    for (const node of files) {
        if (node.id === parentId && node.children) {
            node.children.push(file);
            return true;
        }

        if (node.children) {
            const added = addFileToParent(node.children, parentId, file);
            if (added) return true;
        }
    }
    return false;
};

export const mergeFiles = (
    serverFiles: File[],
    pendingFiles: File[]
): File[] => {
    const merged = structuredClone(serverFiles);

    pendingFiles.forEach(pending => {
        if (!pending.parent) return;

        const parentId =
            typeof pending.parent === 'number'
                ? pending.parent
                : pending.parent.id;

        addFileToParent(merged, parentId, pending);
    });

    return merged;
};

export const extractOpenFolders = (files: File[]): Set<number> => {
    const openFolders = new Set<number>();

    const walk = (nodes: File[]) => {
        nodes.forEach(node => {
            if (
                node.type === FileType.Folder &&
                node.status === FileStatus.Opened
            ) {
                openFolders.add(node.id as number);
            }

            if (node.children) {
                walk(node.children);
            }
        });
    };

    walk(files);
    return openFolders;
};

export const restoreOpenFolders = (
    files: File[],
    openFolders: Set<number>
): File[] => {
    const walk = (nodes: File[]) =>
        nodes.map(node => {
            if (
                node.type === FileType.Folder &&
                openFolders.has(node.id as number)
            ) {
                node = {
                    ...node,
                    status: FileStatus.Opened
                };
            }

            if (node.children) {
                node = {
                    ...node,
                    children: walk(node.children)
                };
            }

            return node;
        });

    return walk(files);
};