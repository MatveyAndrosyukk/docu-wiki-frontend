import {FileType} from "../../types/file";
import {UiFile} from "../../store/types/UiFile";
import {CreateFilePayload} from "../../types/CreateFilePayload";

export function checkIfNameExistsInFolder(
    files: UiFile[],
    folderId: number | null,
    name: string
): boolean {
    function findFolderById(nodes: UiFile[]): UiFile | null {
        for (const node of nodes) {
            if (node.id === folderId && node.type === FileType.Folder) {
                return node;
            }

            if (node.children?.length) {
                const found = findFolderById(node.children);
                if (found) return found;
            }
        }
        return null;
    }

    if (folderId === null) {
        return files.some(file => file.name === name);
    }

    const targetFolder = findFolderById(files);
    return targetFolder
        ? targetFolder.children.some(child => child.name === name)
        : false;
}

export function isNameExistsInRoot(files: UiFile[], name: string): boolean {
    return files.some(file => file.name === name && file.parent === null);
}

export function checkNameConflictInFolder(
    files: UiFile[],
    folderId: number | null,
    name: string
): boolean {
    return checkIfNameExistsInFolder(files, folderId, name);
}

export function createFilePayload(
    name: string,
    type: FileType,
    parent: number | null,
    targetUserEmail: string,
): CreateFilePayload {

    return {
        name,
        type,
        parent,
        targetUserEmail,
        ...(type === FileType.File && {content: ""}),
    };
}

export const countFilesRecursively = (node: UiFile): number => {
    let count = 0;

    for (const child of node.children) {
        if (child.type === FileType.File) {
            count += 1;
        }

        if (child.type === FileType.Folder) {
            count += countFilesRecursively(child);
        }
    }

    return count;
};