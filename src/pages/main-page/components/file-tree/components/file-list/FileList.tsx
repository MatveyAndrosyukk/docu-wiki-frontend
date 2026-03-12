import React, {useCallback} from 'react';
import styles from './FileList.module.scss';
import {useDispatch, useSelector} from 'react-redux';
import useContextMenuActions from '../../../../../../shared/lib/hooks/useContextMenuActions';
import ContextMenu from '../../../../../../shared/ui/context-menu/ContextMenu';
import {TreeNode, useFlattenedTree} from '../../../../../../shared/lib/hooks/useFlattenedTree';
import FileNode from './components/virtualized-row/FileNode';
import {selectFileTree} from "../../../../../../store/selectors/selectFileTree";
import {toggleFolder} from "../../../../../../store/slices/fileUiSlice";
import commonStyles from "../../../../../../assets/styles/Common.module.scss";
import {useAuth} from "../../../../../../shared/lib/hooks/useAuth";
import {useAppContext} from "../../../../../../shared/lib/hooks/useAppContext";
import {RootState} from "../../../../../../store";

interface FileListProps {
    emailParam: string | undefined;
    windowWidth: number;
}

const FileList: React.FC<FileListProps> = React.memo(
    ({emailParam, windowWidth}) => {
        const dispatch = useDispatch();

        const {fileState} = useAppContext();
        const {authStatus} = useAuth();

        const files = useSelector(selectFileTree)
        const viewedUser = useSelector((state: RootState) => state.user.viewedUser);
        const loggedInUser = useSelector((state: RootState) => state.user.loggedInUser);

        const contextMenuState = useContextMenuActions();
        const {state, handleCloseContextMenu} = contextMenuState;

        const flattenedNodes = useFlattenedTree(files);

        const handleFolderClick = useCallback(
            (id: number) => {
                dispatch(toggleFolder({id, tree: files}));
            },
            [dispatch, files],
        );

        return (
            <div
                className={styles['file-list']}
                style={{maxHeight: windowWidth < 1270 ? '300px' : '81vh'}}
            >
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
                            emailParam={emailParam}
                            onFolderClick={handleFolderClick}
                            contextMenuState={contextMenuState}
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