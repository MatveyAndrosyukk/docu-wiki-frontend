import React from 'react';
import styles from './FileList.module.scss';
import {useSelector} from 'react-redux';
import ContextMenu from '../../../../../../shared/ui/context-menu/ContextMenu';
import {TreeNode, useFlattenedTree} from '../../../../../../shared/lib/hooks/useFlattenedTree';
import FileNode from './components/file-node/FileNode';
import {selectFileTree} from "../../../../../../store/selectors/selectFileTree";
import commonStyles from "../../../../../../shared/assets/styles/Common.module.scss";
import {useAppContext} from "../../../../../../context/app-context/hooks/useAppContext";
import {useWindowWidth} from "../../../../../../shared/lib/hooks/useWindowWidth";

interface FileListProps {
    viewedUserEmail: string | undefined;
}

const FileList: React.FC<FileListProps> = React.memo(
    (
        {
            viewedUserEmail,
        }
    ) => {

        const {
            filesHandler,
        } = useAppContext();

        const {
            fileActionsHandler
        } = filesHandler;

        const files = useSelector(
            selectFileTree
        );

        const {
            contextMenuHandler,
        } = filesHandler;

        const flattenedNodes = useFlattenedTree(
            files
        );

        const windowWidth = useWindowWidth();

        const maxHeight = windowWidth < 1270
            ? '300px'
            : '81vh';

        return (
            <div
                className={
                    styles['file-list']
                }

                style={
                    {
                        maxHeight
                    }
                }
            >
                {

                    fileActionsHandler.state.isLimitError && (

                        <div className={
                            commonStyles['common__notification']
                        }
                        >
                            You've reached the free plan limit of 20 files.
                            Upgrade to Premium to create more.
                        </div>
                    )
                }

                <div>
                    {

                        flattenedNodes.map(
                            (
                                node: TreeNode
                            ) => (

                                <FileNode
                                    key={
                                        node.file.id
                                    }

                                    node={
                                        node
                                    }

                                    emailParam={
                                        viewedUserEmail
                                    }
                                />
                            )
                        )
                    }
                </div>

                {

                    (
                        contextMenuHandler.state.visible &&
                        contextMenuHandler.state.file) && (

                        <ContextMenu/>
                    )
                }
            </div>
        );
    },
    (
        prev,
        next
    ) =>
        prev.viewedUserEmail === next.viewedUserEmail
);

export default FileList;