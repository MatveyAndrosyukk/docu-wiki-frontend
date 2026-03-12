import {FileStatus, FileType} from "../../../types/file";
import {UiFile} from "../../../store/types/UiFile";

export interface TreeNode {
    file: UiFile;
    depth: number;
    index: number;
    isLastChild: boolean;
    hasNextOnLevel: boolean[];
}

export const useFlattenedTree = (files: UiFile[]): TreeNode[] => {
    const flattened: TreeNode[] = [];

    const flattenNode = (
        node: UiFile,
        depth: number,
        index: number,
        isLastChild: boolean,
        parentHasNextOnLevel: boolean[]
    ) => {
        const hasNextOnLevel = [...parentHasNextOnLevel];

        if (depth > 0) {
            hasNextOnLevel[depth - 1] = !isLastChild;
        }

        flattened.push({file: node, depth, index, isLastChild, hasNextOnLevel});

        if (
            node.type === FileType.Folder &&
            node.status === FileStatus.Opened &&
            node.children
        ) {
            node.children.forEach((child, childIdx) => {
                const childIsLast = childIdx === node.children!.length - 1;
                flattenNode(
                    child,
                    depth + 1,
                    flattened.length,
                    childIsLast,
                    hasNextOnLevel
                );
            });
        }
    };

    files.forEach((root, idx) => {
        const isLast = idx === files.length - 1;
        flattenNode(root, 0, 0, isLast, []);
    });

    return flattened;
};