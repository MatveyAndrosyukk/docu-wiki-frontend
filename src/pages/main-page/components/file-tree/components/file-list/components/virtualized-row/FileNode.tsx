import {TreeNode} from "../../../../../../../../utils/hooks/useFlattenedTree";
import React from "react";
import styles from "../../FileList.module.scss"
import {isUserCanEdit} from "../../../../../../../../utils/functions/permissions-utils/isUserCanEdit";
import {FileStatus, FileType} from "../../../../../../../../types/file";
import ChildLine from '../../images/file-list-child-line.svg';
import LastChildLine from '../../images/file-list-last-child-line.svg';
import OpenedImg from '../../images/file-list-opened.svg';
import ClosedImg from '../../images/file-list-closed.svg';
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

        const lineSrc = isLastLevel
            ? (isLastChild ? LastChildLine : ChildLine)
            : ChildLine;

        return (
            <span className={styles['file-list__node-line']} key={levelIndex}>
          <img style={{width: 10}} src={lineSrc} alt="line"/>
        </span>
        );
    })}
  </span>
        );

        const openContextMenuHandler = (e: React.MouseEvent<HTMLDivElement>) => {
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
                            onContextMenu={openContextMenuHandler}
                            onClick={() => onFolderClick(file.id)}
                        >
                            <img
                                src={file.status === FileStatus.Opened ? OpenedImg : ClosedImg}
                                alt="Folder"
                                style={{marginRight: 8}}
                            />
                            {file.isPending ? (
                                <FileLoader/>
                            ) : (
                                <span className={styles['file-list__node-text']}>
                                {file.name}
                            </span>
                            )}
                        </div>
                    ) : (
                        <div
                            className={styles['file-list__node-file']}
                            onContextMenu={!file.isPending ? openContextMenuHandler : undefined}
                            onClick={!file.isPending ? () => handleTryToOpenFile(file.id) : undefined}
                        >
                            {file.isPending ? (
                                <>
                                    <FileLoader/>
                                </>
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
    }, (prevProps, nextProps) => {
        return prevProps.node.file.id === nextProps.node.file.id &&
            prevProps.node.file.status === nextProps.node.file.status &&
            prevProps.node.file.name === nextProps.node.file.name &&
            prevProps.node.depth === nextProps.node.depth &&
            prevProps.node.isLastChild === nextProps.node.isLastChild;
    });

export default FileNode;