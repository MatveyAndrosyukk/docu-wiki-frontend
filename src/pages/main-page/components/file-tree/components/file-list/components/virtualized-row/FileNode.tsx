import {TreeNode} from "../../../../../../../../utils/hooks/useFlattenedTree";
import React, {useRef} from "react";
import styles from "../../FileList.module.scss"
import {isUserCanEdit} from "../../../../../../../../utils/functions/permissions-utils/isUserCanEdit";
import {FileStatus, FileType} from "../../../../../../../../types/file";
import {ReactComponent as ChildLineSvg} from '../../images/file-list-child-line.svg';
import {ReactComponent as LastChildLineSvg} from '../../images/file-list-last-child-line.svg';
import {ReactComponent as OpenedSvg} from '../../images/file-list-opened.svg';
import {ReactComponent as ClosedSvg} from '../../images/file-list-closed.svg';
import {ReactComponent as FileImg} from '../../images/file-list-file.svg';
import {User} from "../../../../../../../../store/slices/userSlice";
import FileLoader from "../../../../../../../../ui-components/file-loader/FileLoader";
import {useSelector} from "react-redux";
import {selectOpenedFile} from "../../../../../../../../store/selectors/selectOpenedFile";

interface Props {
    node: TreeNode;
    emailParam: string | undefined;
    onFolderClick: (id: number) => void;
    contextMenuState: any;
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
                            <span className={styles['file-list__node-line']} key={levelIndex}>
                                {/* пустое место */}
                            </span>
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

        return (
            <div
                className={styles['file-list__node']}
                key={file.id}
            >
                <div className={styles['file-list__node-container']}>
                    {linesBlock}
                    {file.type === FileType.Folder ? (
                        <div
                            className={styles['file-list__node-folder']}
                            onContextMenu={!file.isPending ? handleOpenContextMenu : undefined}
                            onClick={!file.isPending ? () => onFolderClick(file.id) : undefined}
                            onTouchStart={!file.isPending ? handleTouchStart : undefined}
                            onTouchEnd={cancelLongPress}
                            onTouchMove={cancelLongPress}
                        >
                            {file.status === FileStatus.Opened ? (
                                <OpenedSvg style={{marginRight: 8}}/>
                            ) : (
                                <ClosedSvg style={{marginRight: 8}}/>
                            )}
                            {file.isPending ? <FileLoader/> : <span>{file.name}</span>}
                        </div>
                    ) : (
                        <div
                            className={styles['file-list__node-file']}
                            onContextMenu={!file.isPending ? handleOpenContextMenu : undefined}
                            onClick={!file.isPending ? () => handleTryToOpenFile(file.id) : undefined}
                            onTouchStart={!file.isPending ? handleTouchStart : undefined}
                            onTouchEnd={cancelLongPress}
                            onTouchMove={cancelLongPress}
                        >
                            {file.isPending ? (
                                <FileLoader/>
                            ) : (
                                <>
                                    <FileImg className={styles['file-list__node-image']}/>
                                    <span
                                        className={`${styles['file-list__node-text']} ${
                                            file.id === openedFile?.id ? styles['file-list__node-text--opened'] : ''
                                        }`}
                                    >
                                        {file.name}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
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