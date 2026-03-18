import {TreeNode} from "../../../../../../../../shared/lib/hooks/useFlattenedTree";
import React, {useRef} from "react";
import styles from "../../FileList.module.scss"
import {isUserCanEdit} from "../../../../../../../../shared/lib/utils/permissions-utils/isUserCanEdit";
import {FileStatus, FileType} from "../../../../../../../../types/file";
import {ReactComponent as ChildLineSvg} from '../../images/file-list-child-line.svg';
import {ReactComponent as LastChildLineSvg} from '../../images/file-list-last-child-line.svg';
import {ReactComponent as OpenedSvg} from '../../images/file-list-opened.svg';
import {ReactComponent as ClosedSvg} from '../../images/file-list-closed.svg';
import {ReactComponent as FileImg} from '../../images/file-list-file.svg';
import {User} from "../../../../../../../../store/slices/userSlice";
import FileLoader from "../../../../../../../../shared/ui/file-loader/FileLoader";
import {useSelector} from "react-redux";
import {selectOpenedFile} from "../../../../../../../../store/selectors/selectOpenedFile";
import {ContextMenuState} from "../../../../../../../../shared/lib/hooks/useContextMenuActions";

interface Props {
    node: TreeNode;
    emailParam: string | undefined;
    onFolderClick: (id: number) => void;
    contextMenuState: ContextMenuState;
    isLoggedIn: boolean;
    handleTryToOpenFile: (id: number) => void;
    viewedUser: User | null;
    loggedInUser: User | null;
}

const FileNode: React.FC<Props> = React.memo(
    ({
         node,
         emailParam,
         onFolderClick,
         contextMenuState,
         isLoggedIn,
         handleTryToOpenFile,
         viewedUser,
         loggedInUser,
     }) => {
        const {file, depth, isLastChild, hasNextOnLevel} = node;

        const openedFile = useSelector(selectOpenedFile)

        const longPressTimer = useRef<NodeJS.Timeout | null>(null);

        const linesBlock = (
            <span className={styles['file-list__node-line-block']}>
                {Array.from({length: depth}).map((_, levelIndex) => {
                    const isLastLevel = levelIndex === depth - 1;

                    if (!isLastLevel && !hasNextOnLevel[levelIndex]) {
                        return (
                            <span className={styles['file-list__node-line']} key={levelIndex}></span>
                        );
                    }

                    const LineComponent = isLastLevel
                        ? (isLastChild ? LastChildLineSvg : ChildLineSvg)
                        : ChildLineSvg;

                    return (
                        <span className={styles['file-list__node-line']} key={levelIndex}>
                            <LineComponent style={{width: 10}}/>
                        </span>
                    );
                })}
            </span>
        );

        const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
            if (!isUserCanEdit(isLoggedIn, emailParam, viewedUser, loggedInUser)) return;

            const touch = e.touches[0];

            longPressTimer.current = setTimeout(() => {
                contextMenuState.handleOpenContextMenu(
                    {
                        preventDefault: () => {
                        },
                        clientX: touch.clientX,
                        clientY: touch.clientY
                    } as any,
                    file
                );
            }, 600);
        };

        const cancelLongPress = () => {
            if (longPressTimer.current) {
                clearTimeout(longPressTimer.current);
                longPressTimer.current = null;
            }
        };

        const handleOpenContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
            if (isUserCanEdit(isLoggedIn, emailParam, viewedUser, loggedInUser)) {
                contextMenuState.handleOpenContextMenu(e, file);
            }
        };

        const isFolder = file.type === FileType.Folder;
        const clickHandler = isFolder ? () => onFolderClick(file.id) : () => handleTryToOpenFile(file.id);
        const contextMenuHandler = !file.isPending ? handleOpenContextMenu : undefined;
        const touchStartHandler = !file.isPending ? handleTouchStart : undefined;

        return (
            <div className={styles['file-list__node']} key={file.id}>
                <div className={styles['file-list__node-container']}>
                    {linesBlock}

                    <div
                        className={isFolder ? styles['file-list__node-folder'] : styles['file-list__node-file']}>
                        {file.isPending ? (
                            <FileLoader/>
                        ) : (
                            <div
                                onClick={!file.isPending ? clickHandler : undefined}
                                className={styles['file-list__node-content']}>
                                {isFolder ? (
                                    file.status === FileStatus.Opened
                                        ? <OpenedSvg style={{marginRight: 8}}/>
                                        : <ClosedSvg style={{marginRight: 8}}/>
                                ) : <FileImg className={styles['file-list__node-image']}/>}

                                <span
                                    className={`${styles['file-list__node-text']} ${
                                        !isFolder && file.id === openedFile?.id
                                            ? styles['file-list__node-text--opened']
                                            : ''
                                    }`}
                                    onContextMenu={contextMenuHandler}
                                    onTouchStart={touchStartHandler}
                                    onTouchEnd={cancelLongPress}
                                    onTouchMove={cancelLongPress}
                                >
                                    {file.name}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    },
    (prevProps, nextProps) => {
        return prevProps.node.file.id === nextProps.node.file.id &&
            prevProps.node.file.status === nextProps.node.file.status &&
            prevProps.node.file.name === nextProps.node.file.name &&
            prevProps.node.depth === nextProps.node.depth &&
            prevProps.node.isLastChild === nextProps.node.isLastChild;
    }
);

export default FileNode;