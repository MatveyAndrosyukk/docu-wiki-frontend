import {TreeNode} from "../../../../../../../../shared/lib/hooks/useFlattenedTree";
import React, {useCallback, useRef} from "react";
import styles from "../../FileList.module.scss";
import nodeStyles from './FileNode.module.scss';
import {isUserCanEdit} from "../../../../../../../../shared/lib/utils/permissions-utils/isUserCanEdit";
import {FileStatus, FileType} from "../../../../../../../../types/file";
import {ReactComponent as LineSvg} from '../../images/file-list-line.svg';
import {ReactComponent as ChildLineSvg} from '../../images/file-list-child-line.svg';
import {ReactComponent as LastChildLineSvg} from '../../images/file-list-last-child-line.svg';
import {ReactComponent as OpenedSvg} from '../../images/file-list-opened.svg';
import {ReactComponent as ClosedSvg} from '../../images/file-list-closed.svg';
import {ReactComponent as FileImg} from '../../images/file-list-file.svg';
import FileLoader from "../../../../../../../../shared/ui/file-loader/FileLoader";
import {useDispatch, useSelector} from "react-redux";
import {selectOpenedFile} from "../../../../../../../../store/selectors/selectOpenedFile";
import {useNavigate} from "react-router-dom";
import {useAppContext} from "../../../../../../../../context/app-context/hooks/useAppContext";
import {AppDispatch, RootState} from "../../../../../../../../store";
import {useAuthContext} from "../../../../../../../../context/auth-context/hooks/useAuthContext";
import {toggleFolder} from "../../../../../../../../store/slices/fileUiSlice";
import {selectFileTree} from "../../../../../../../../store/selectors/selectFileTree";

interface Props {
    node: TreeNode;

    emailParam: string | undefined;
}

const FileNode: React.FC<Props> = React.memo(
    (
        {
            node,
            emailParam,
        }
    ) => {

        const {
            file,
            depth,
            isLastChild,
            hasNextOnLevel
        } = node;

        const {
            filesHandler,
            editorHandler,
        } = useAppContext();

        const {
            authStatus,
        } = useAuthContext();

        const {
            contextMenuHandler,
        } = filesHandler;

        const {
            editModeHandler
        } = editorHandler;

        const reduxDispatch = useDispatch<AppDispatch>();

        const navigate = useNavigate();

        const openedFile = useSelector(
            selectOpenedFile
        );

        const files = useSelector(
            selectFileTree
        );

        const loggedInUser = useSelector(
            (state: RootState) => state.user.loggedInUser
        );

        const viewedUser = useSelector(
            (state: RootState) => state.user.viewedUser
        );

        const longPressTimer =
            useRef<NodeJS.Timeout | null>(null);

        const linesBlock = (

            <span
                className={
                    styles['file-list__node-line-block']
                }
            >
                {

                    Array.from(
                        {
                            length: depth
                        }
                    ).map(
                        (
                            _,
                            levelIndex
                        ) => {
                            const isLastLevel = levelIndex === depth - 1;

                            if (!isLastLevel) {

                                if (!hasNextOnLevel[levelIndex]) {

                                    return (
                                        <span
                                            className={
                                                styles['file-list__node-line']
                                            }

                                            key={
                                                levelIndex
                                            }
                                        />
                                    );
                                }

                                return (

                                    <span
                                        className={
                                            styles['file-list__node-line']
                                        }

                                        key={
                                            levelIndex
                                        }
                                    >
                                    <LineSvg
                                        className={
                                            nodeStyles.line
                                        }
                                    />
                                </span>
                                );
                            }

                            const LineComponent = isLastChild
                                ? LastChildLineSvg
                                : ChildLineSvg;

                            return (
                                <span
                                    className={
                                        styles['file-list__node-line']
                                    }

                                    key={
                                        levelIndex
                                    }
                                >
                                <LineComponent
                                    className={
                                        nodeStyles.lineComponent
                                    }
                                />
                            </span>
                            );
                        }
                    )
                }
            </span>
        );

        const handleFolderClick = useCallback(
            (
                id: number
            ) => {

                reduxDispatch(
                    toggleFolder(
                        {
                            id,
                            tree: files
                        }
                    )
                );
            },
            [
                reduxDispatch,
                files
            ],
        );

        const handleTouchStart = (
            e: React.TouchEvent<HTMLDivElement>
        ) => {

            if (!isUserCanEdit(
                authStatus === 'authenticated',
                emailParam,
                viewedUser,
                loggedInUser
            )) return;

            const touch = e.touches[0];

            longPressTimer.current = setTimeout(
                () => {

                    contextMenuHandler.actions.open(
                        {
                            preventDefault: () => {
                            },
                            clientX: touch.clientX,
                            clientY: touch.clientY
                        } as any,
                        file
                    );
                },
                600
            );
        };

        const cancelLongPress = () => {

            if (longPressTimer.current) {

                clearTimeout(longPressTimer.current);

                longPressTimer.current = null;
            }
        };

        const handleOpenContextMenu = (
            e: React.MouseEvent<HTMLDivElement>
        ) => {

            if (isUserCanEdit(
                authStatus === 'authenticated',
                emailParam,
                viewedUser,
                loggedInUser
            )) {

                contextMenuHandler.actions.open(e, file);
            }
        };

        const isFolder = file.type === FileType.Folder;

        const clickHandler = isFolder
            ? () => handleFolderClick(
                file.id
            )
            : () => {

                editModeHandler.actions.tryToOpenFile(
                    file.id
                );

                navigate(
                    `/${viewedUser?.name}/file/${file.id}`
                );
            };

        return (

            <div
                className={
                    styles['file-list__node']
                }

                key={
                    file.id
                }
            >
                <div
                    className={
                        styles['file-list__node-container']
                    }
                >
                    {
                        linesBlock
                    }

                    <div
                        className={isFolder
                            ? styles['file-list__node-folder']
                            : styles['file-list__node-file']
                        }
                    >
                        {

                            file.isPending ? (

                                <FileLoader/>
                            ) : (

                                <div
                                    className={
                                        styles['file-list__node-content']
                                    }

                                    onClick={
                                        !file.isPending
                                            ? clickHandler
                                            : undefined
                                    }
                                >
                                    {

                                        isFolder ? (

                                            file.status === FileStatus.Opened
                                                ? <OpenedSvg
                                                    style={
                                                        {
                                                            marginRight: 8
                                                        }
                                                    }
                                                />
                                                : <ClosedSvg
                                                    style={
                                                        {
                                                            marginRight: 8
                                                        }
                                                    }
                                                />
                                        ) : <FileImg
                                            className={
                                                styles['file-list__node-image']
                                            }
                                        />
                                    }

                                    <span
                                        className={`
                                            ${styles['file-list__node-text']}                                          
                                            ${(!isFolder && file.id === openedFile?.id)
                                            ? styles['file-list__node-text--opened']
                                            : ''}`
                                        }

                                        onContextMenu={
                                            !file.isPending
                                                ? handleOpenContextMenu
                                                : undefined
                                        }

                                        onTouchStart={
                                            !file.isPending
                                                ? handleTouchStart
                                                : undefined
                                        }

                                        onTouchEnd={
                                            cancelLongPress
                                        }

                                        onTouchMove={
                                            cancelLongPress
                                        }

                                    >

                                    {
                                        file.name
                                    }
                                    </span>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        );
    },
    (
        prevProps,
        nextProps
    ) => {
        return prevProps.node.file.id === nextProps.node.file.id &&
            prevProps.node.file.status === nextProps.node.file.status &&
            prevProps.node.file.name === nextProps.node.file.name &&
            prevProps.node.depth === nextProps.node.depth &&
            prevProps.node.isLastChild === nextProps.node.isLastChild;
    }
);

export default FileNode;