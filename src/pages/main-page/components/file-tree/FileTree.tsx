import React, {Dispatch, FC, SetStateAction, useCallback, useMemo, useRef} from 'react';
import styles from './FileTree.module.scss'
import commonStyles from '../../../../styles/Common.module.scss'
import {ReactComponent as LockSvg} from './images/fileTree-lock.svg'
import {ReactComponent as BanSvg} from './images/fileTree-ban.svg'
import FileList from "./components/file-list/FileList";
import {AppDispatch, RootState} from "../../../../store";
import {useDispatch, useSelector} from "react-redux";
import {toggleUserIsViewBlocked} from "../../../../store/thunks/user/toggleUserIsViewBlocked";
import {ActionType} from "../../../../utils/supporting-hooks/useModalActions";
import {isUserCanEdit} from "../../../../utils/functions/permissions-utils/isUserCanEdit";
import {isUserCanView} from "../../../../utils/functions/permissions-utils/isUserCanView";
import {isUserEqualsLoggedIn} from "../../../../utils/functions/permissions-utils/isUserEqualsLoggedIn";
import {isUserOwner} from "../../../../utils/functions/permissions-utils/isUserOwner";
import FileTreeSkeleton from "../../../../ui-components/FileTreeSkeleton";
import {useAuth} from "../../../../utils/hooks/useAuth";
import {useAppContext} from "../../../../utils/hooks/useAppContext";
import {useWindowWidth} from "../../../../utils/hooks/useWindowWidth";
import {useNotification} from "../../../../utils/hooks/useNotification";
import {useElementOutsideEvent} from "../../../../utils/hooks/useElementOutsideEvent";

interface FileTreeProps {
    emailParam: string | undefined;
    isOpened: boolean;
    setIsOpened: Dispatch<SetStateAction<boolean>>;
}

const FileTree: FC<FileTreeProps> = React.memo(({emailParam, isOpened, setIsOpened}) => {

        const dispatch = useDispatch<AppDispatch>();

        const {authState, fileState, banState} = useAppContext();
        const {authStatus} = useAuth();

        const viewedUser = useSelector((state: RootState) => state.user.viewedUser)
        const loggedInUser = useSelector((state: RootState) => state.user.loggedInUser)
        const areFilesLoading = useSelector((state: RootState) => state.fileServer.loading);
        const isViewedUserLoading = useSelector((state: RootState) => state.user.isViewedUserLoading);

        const {setIsBanModalOpened} = banState;
        const {setIsLoginModalOpen} = authState;
        const {handleOpenModalByReason} = fileState;

        const fileTreeRef = useRef<HTMLDivElement>(null);

        const windowWidth = useWindowWidth();

        const notification = useNotification();

        useElementOutsideEvent(
            fileTreeRef,
            'dblclick',
            () => setIsOpened(false),
            isOpened && windowWidth < 1270
        );

        const fileTreeStyles = useMemo(() => {
            if (!isOpened) return styles['file-tree-closed'];

            if (windowWidth < 1270) {
                return `${styles['file-tree']} ${styles['file-tree--fixed']}`;
            }

            return styles['file-tree'];
        }, [isOpened, windowWidth]);

        const blockViewHandler = useCallback(async () => {
            if (!viewedUser?.email) return;

            notification.show();

            try {
                await dispatch(toggleUserIsViewBlocked(viewedUser.email)).unwrap();
            } catch (error) {
                console.error(error);
            }

        }, [dispatch, viewedUser, notification]);

        const handleCreateRootFolder = useCallback(() => {

            if (authStatus === 'authenticated') {
                handleOpenModalByReason({
                    reason: ActionType.AddRootFolder,
                    id: null,
                    title: "Add root folder",
                });
            } else {
                setIsLoginModalOpen(true);
            }

        }, [authStatus, handleOpenModalByReason, setIsLoginModalOpen]);

        const isBanned = !!viewedUser?.banned;

        return (
            <div ref={fileTreeRef} className={fileTreeStyles}>

                {notification.visible && (
                    <div
                        key={notification.id}
                        onClick={notification.close}
                        className={`${commonStyles['common__notification']} ${
                            notification.closing
                                ? commonStyles['common__notification--closing']
                                : ''
                        }`}
                    >
                        You {viewedUser?.isViewBlocked ? 'blocked' : 'unblocked'} files for view
                    </div>
                )}

                <div className={styles['file-tree__content']}>

                    {(isViewedUserLoading || areFilesLoading || authStatus === 'loading')
                        ? <FileTreeSkeleton/>
                        : (
                            <>
                                {isUserEqualsLoggedIn(emailParam, authStatus === 'authenticated', viewedUser) && (
                                    <div className={styles['file-tree__header']}>
                                        <div className={styles['file-tree__top']}>
                                            <div className={styles['file-tree__user']}>
                                                {viewedUser?.email}
                                            </div>

                                            {isUserOwner(loggedInUser) && (
                                                <div
                                                    className={styles['file-tree__ban']}
                                                    onClick={() => setIsBanModalOpened(true)}
                                                >
                                                    <BanSvg/>
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles['file-tree__line']}/>
                                    </div>
                                )}

                                {isBanned
                                    ? (
                                        <div className={styles['file-tree__view']}>
                                            This user has been banned
                                        </div>
                                    )
                                    : (
                                        !isUserCanView(viewedUser, loggedInUser) && (
                                            <div className={styles['file-tree__view']}>
                                                User blocked his files for view
                                            </div>
                                        )
                                    )
                                }

                                {!isBanned && isUserCanEdit(
                                    authStatus === 'authenticated',
                                    emailParam,
                                    viewedUser,
                                    loggedInUser
                                ) && (
                                    <div className={styles['file-tree__buttons']}>

                                        <div
                                            className={styles['file-tree__button-create']}
                                            onClick={handleCreateRootFolder}
                                        >
                                            Create a root folder
                                        </div>

                                        {authStatus === 'authenticated' && (
                                            <div
                                                className={styles['file-tree__button-block']}
                                                title={viewedUser?.isViewBlocked
                                                    ? 'Unblock view for other users'
                                                    : 'Block view for other users'}
                                                onClick={blockViewHandler}
                                                style={{
                                                    background: viewedUser?.isViewBlocked
                                                        ? '#191A1A'
                                                        : '#202222'
                                                }}
                                            >
                                                <LockSvg/>
                                            </div>
                                        )}

                                    </div>
                                )}

                                {viewedUser &&
                                    !isBanned &&
                                    isUserCanView(viewedUser, loggedInUser) && (
                                        <div className={styles['file-tree__files']}>
                                            <FileList
                                                windowWidth={windowWidth}
                                                emailParam={emailParam}
                                            />
                                        </div>
                                    )
                                }
                            </>
                        )
                    }

                </div>
            </div>
        );

    }, (prev, next) =>
        prev.isOpened === next.isOpened &&
        prev.emailParam === next.emailParam
);

export default FileTree;