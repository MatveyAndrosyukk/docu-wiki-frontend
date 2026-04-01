import React, {useCallback} from 'react';
import styles from './FileList.module.scss';
import {useDispatch, useSelector} from 'react-redux';
import useContextMenuActions from '../../../../../../shared/lib/hooks/useContextMenuActions';
import ContextMenu from '../../../../../../shared/ui/context-menu/ContextMenu';
import {TreeNode, useFlattenedTree} from '../../../../../../shared/lib/hooks/useFlattenedTree';
import FileNode from './components/file-node/FileNode';
import {selectFileTree} from "../../../../../../store/selectors/selectFileTree";
import {toggleFolder} from "../../../../../../store/slices/fileUiSlice";
import commonStyles from "../../../../../../shared/assets/styles/Common.module.scss";
import {useAuth} from "../../../../../../shared/lib/hooks/useAuth";
import {useAppContext} from "../../../../../../shared/lib/hooks/useAppContext";
import {RootState} from "../../../../../../store";

interface FileListProps {
    viewedUserEmail: string | undefined;
    windowWidth: number;
}

const FileList: React.FC<FileListProps> = React.memo(
    ({viewedUserEmail, windowWidth}) => {
        const dispatch = useDispatch();

        const {fileState} = useAppContext();
        const {authStatus} = useAuth();

        const files = useSelector(selectFileTree)
        const viewedUser = useSelector((state: RootState) => state.user.viewedUser);
        const loggedInUser = useSelector((state: RootState) => state.user.loggedInUser);

        const contextMenu = useContextMenuActions();
        const {state, handleCloseContextMenu, menuRef} = contextMenu;

        const flattenedNodes = useFlattenedTree(files);

        const handleFolderClick = useCallback(
            (id: number) => {
                dispatch(toggleFolder({id, tree: files}));
            },
            [dispatch, files],
        );

        const maxHeight = windowWidth < 1270 ? '300px' : '81vh';

        return (
            <div className={styles['file-list']} style={{maxHeight}}>
                {fileState.isLimitError && (
                    <div className={commonStyles['common__notification']}>
                        You can't create more than 20 files without premium :(
                    </div>
                )}

                <div>
                    {flattenedNodes.map((node: TreeNode) => (
                        <FileNode
                            key={node.file.id}
                            node={node}
                            emailParam={viewedUserEmail}
                            onFolderClick={handleFolderClick}
                            contextMenuState={contextMenu}
                            viewedUser={viewedUser}
                            loggedInUser={loggedInUser}
                            handleTryToOpenFile={fileState.handleTryToOpenFile}
                            isLoggedIn={authStatus === 'authenticated'}
                        />
                    ))}
                </div>

                {state.visible && state.file && (
                    <ContextMenu
                        clickX={state.clickX}
                        clickY={state.clickY}
                        file={state.file}
                        onCloseContextMenu={handleCloseContextMenu}
                        menuRef={menuRef}
                    />
                )}
            </div>
        );
    },
    (prev, next) =>
        prev.viewedUserEmail === next.viewedUserEmail &&
        prev.windowWidth === next.windowWidth,
);

export default FileList;