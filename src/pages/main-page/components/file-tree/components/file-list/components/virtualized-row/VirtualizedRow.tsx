import {TreeNode} from "../../../../../../../../utils/hooks/useFlattenedTree";
import React, {useEffect} from "react";
import {AppContext} from "../../../../../../../../context/AppContext";
import styles from "../../FileList.module.scss"
import {isUserCanEdit} from "../../../../../../../../utils/functions/permissions-utils/isUserCanEdit";
import {FileStatus, FileType} from "../../../../../../../../types/file";
import ChildLine from '../../images/file-list-child-line.svg';
import LastChildLine from '../../images/file-list-last-child-line.svg';
import OpenedImg from '../../images/file-list-opened.svg';
import ClosedImg from '../../images/file-list-closed.svg';
import {ReactComponent as FileImg} from '../../images/file-list-file.svg';
import {User} from "../../../../../../../../store/slices/userSlice";


interface VirtualizedRowProps {
    node: TreeNode;
    emailParam: string | undefined;
    onFolderClick: (id: number | null) => void;
    contextMenuState: any;
    isLoggedIn: boolean;
    handleTryToOpenFile: (id: number | null) => void;
    viewedUser: User | null;
    loggedInUser: User | null;
}

const VirtualizedRow: React.FC<VirtualizedRowProps> = React.memo(
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
        const {file, depth, isLastChild} = node;

        useEffect(() => {
            console.log('перерисовка')
        }, []);

        const linesBlock = (
            <span className={styles['file-list__node-line-block']}>
            {depth > 0 && !isLastChild && (
                <span className={styles['file-list__node-line']}>
          <img style={{width: 10}} src={ChildLine} alt="line"/>
        </span>
            )}
                {depth > 0 && isLastChild && (
                    <span className={styles['file-list__node-line']}>
          <img style={{width: 10}} src={LastChildLine} alt="line"/>
        </span>
                )}
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
                style={{paddingLeft: `${(depth - 1) * 22}px`}}
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
                            {file.name}
                        </div>
                    ) : (
                        <div
                            className={styles['file-list__node-file']}
                            onContextMenu={openContextMenuHandler}
                            onClick={() => handleTryToOpenFile(file.id)}
                        >
                            <FileImg className={styles['file-list__node-image']}/>
                            <span
                                style={{fontWeight: file.status === FileStatus.Opened ? 'bold' : 'normal'}}
                                className={styles['file-list__node-text']}>{file.name}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }, (prevProps, nextProps) => {
        return (
            prevProps.node.file.id === nextProps.node.file.id &&
            prevProps.node.file.status === nextProps.node.file.status &&
            prevProps.node.file.likes === nextProps.node.file.likes &&
            prevProps.node.file.isLiked === nextProps.node.file.isLiked &&
            prevProps.node.depth === nextProps.node.depth &&
            prevProps.node.isLastChild === nextProps.node.isLastChild &&
            prevProps.emailParam === nextProps.emailParam
        );
    });

export default VirtualizedRow;