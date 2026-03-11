import React, {useCallback} from 'react';
import styles from './FileList.module.scss';
import {useDispatch, useSelector} from 'react-redux';
import useContextMenuActions from '../../../../../../utils/hooks/useContextMenuActions';
import ContextMenu from '../../../../../../ui-components/context-menu/ContextMenu';
import {TreeNode, useFlattenedTree} from '../../../../../../utils/hooks/useFlattenedTree';
import FileNode from './components/virtualized-row/FileNode';
import {selectFileTree} from "../../../../../../store/selectors/selectFileTree";
import {toggleFolder} from "../../../../../../store/slices/fileUiSlice";
import commonStyles from "../../../../../../styles/Common.module.scss";
import {useAuth} from "../../../../../../utils/hooks/useAuth";
import {useAppContext} from "../../../../../../utils/hooks/useAppContext";

interface FileListProps {
    emailParam: string | undefined;
    windowWidth: number;
}

const FileList: React.FC<FileListProps> = React.memo(
    ({emailParam, windowWidth}) => {
        const dispatch = useDispatch();

        const {viewedUser, loggedInUser, fileState} = useAppContext();
        const {authStatus} = useAuth();

        const files = useSelector(selectFileTree)

        const contextMenuState = useContextMenuActions();
        const {state, handleCloseContextMenu} = contextMenuState;

        const flattenedNodes = useFlattenedTree(files);

        const onFolderClick = useCallback(
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
                            onFolderClick={onFolderClick}
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