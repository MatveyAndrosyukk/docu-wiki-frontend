import React, {useCallback, useContext} from 'react';
import styles from './FileList.module.scss';
import {useDispatch} from 'react-redux';
import {toggleFolder} from '../../../../../../store/slices/fileTreeSlice';
import {AppContext} from '../../../../../../context/AppContext';
import useContextMenuActions from '../../../../../../utils/hooks/useContextMenuActions';
import ContextMenu from '../../../../../../ui-components/context-menu/ContextMenu';
import {TreeNode, useFlattenedTree} from '../../../../../../utils/hooks/useFlattenedTree';
import FileNode from './components/virtualized-row/FileNode';

interface FileListProps {
    emailParam: string | undefined;
    windowWidth: number;
}

const FileList: React.FC<FileListProps> = React.memo(
    ({emailParam, windowWidth}) => {
        const dispatch = useDispatch();
        const context = useContext(AppContext);
        if (!context) throw new Error('Context required');

        const {files, viewedUser, loggedInUser, fileState, authState} = context;
        const contextMenuAcState = useContextMenuActions();
        const {contextMenuState, handleCloseContextMenu} = contextMenuAcState;

        const flattenedNodes = useFlattenedTree(files);

        const onFolderClick = useCallback(
            (id: number | null) => {
                dispatch(toggleFolder({id}));
            },
            [dispatch],
        );

        return (
            <div
                className={styles['file-list']}
                style={{maxHeight: windowWidth < 1270 ? '300px' : '81vh'}}
            >
                <div>
                    {flattenedNodes.map((node: TreeNode) => (
                        <FileNode
                            key={node.file.id}
                            node={node}
                            emailParam={emailParam}
                            onFolderClick={onFolderClick}
                            contextMenuState={contextMenuAcState}
                            viewedUser={viewedUser}
                            loggedInUser={loggedInUser}
                            handleTryToOpenFile={fileState.handleTryToOpenFile}
                            isLoggedIn={authState.isLoggedIn}
                        />
                    ))}
                </div>

                {contextMenuState.visible && contextMenuState.file && (
                    <ContextMenu
                        clickX={contextMenuState.clickX}
                        clickY={contextMenuState.clickY}
                        file={contextMenuState.file}
                        onCloseContextMenu={handleCloseContextMenu}
                    />
                )}
            </div>
        );
    },
    (prev, next) =>
        prev.emailParam === next.emailParam &&
        prev.windowWidth === next.windowWidth,
);

export default FileList;