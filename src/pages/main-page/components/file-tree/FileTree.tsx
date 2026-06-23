import React, {Dispatch, FC, SetStateAction, useCallback, useMemo, useRef} from 'react';
import styles from './FileTree.module.scss'
import commonStyles from '../../../../shared/assets/styles/Common.module.scss'
import {ReactComponent as LockSvg} from './images/fileTree-lock.svg'
import {ReactComponent as BanSvg} from './images/fileTree-ban.svg'
import FileList from "./components/file-list/FileList";
import {AppDispatch, RootState} from "../../../../store";
import {useDispatch, useSelector} from "react-redux";
import {toggleUserIsViewBlocked} from "../../../../store/thunks/user/toggleUserIsViewBlocked";
import {ActionType} from "../../../../shared/lib/hooks/useModalActions";
import {isUserCanEdit} from "../../../../shared/lib/utils/permissions-utils/isUserCanEdit";
import {isUserCanView} from "../../../../shared/lib/utils/permissions-utils/isUserCanView";
import {isUserEqualsLoggedIn} from "../../../../shared/lib/utils/permissions-utils/isUserEqualsLoggedIn";
import {isUserOwner} from "../../../../shared/lib/utils/permissions-utils/isUserOwner";
import FileTreeSkeleton from "../../../../shared/ui/file-tree-skeleton/FileTreeSkeleton";
import {useAuth} from "../../../../shared/lib/hooks/useAuth";
import {useAppContext} from "../../../../shared/lib/hooks/useAppContext";
import {useWindowWidth} from "../../../../shared/lib/hooks/useWindowWidth";
import {useNotification} from "../../../../shared/lib/hooks/useNotification";
import {useElementOutsideEvent} from "../../../../shared/lib/hooks/useElementOutsideEvent";

interface FileTreeProps {
    viewedUserEmail: string | undefined;
    isOpened: boolean;
    setIsOpened: Dispatch<SetStateAction<boolean>>;
}

const FileTree: FC<FileTreeProps> = React.memo(
    (
        {
            viewedUserEmail,
            isOpened,
            setIsOpened,
        }
    ) => {
        const dispatch =
            useDispatch<AppDispatch>();

        const {
            authState,
            fileState,
            banState,
            premiumState
        } = useAppContext();

        const {authStatus} = useAuth();

        const viewedUser = useSelector(
            (state: RootState) => state.user.viewedUser
        );

        const loggedInUser = useSelector(
            (state: RootState) => state.user.loggedInUser
        );

        const areFilesLoading = useSelector(
            (state: RootState) => state.fileServer.loading
        );

        const isViewedUserLoading = useSelector(
            (state: RootState) => state.user.isViewedUserLoading
        );

        const {setIsBanModalOpened} = banState;

        const {setIsLoginModalOpen} = authState;

        const {handleOpenModalByReason} = fileState;

        const {setIsPremiumModalOpen} = premiumState;

        const fileTreeRef =
            useRef<HTMLDivElement>(null);

        const windowWidth = useWindowWidth();

        const notification = useNotification();

        useElementOutsideEvent(
            fileTreeRef,
            'dblclick',
            () => setIsOpened(false),
            (isOpened && windowWidth < 1270)
        );

        const filesCount =
            viewedUser?.amountOfFiles ??
            0;

        const isWarning =
            !viewedUser?.isPremium &&
            filesCount >= 15;

        const fileTreeStyles = useMemo(
            () => {
                if (!isOpened) return styles['file-tree-closed'];

                if (windowWidth < 1270) {
                    return `${styles['file-tree']} ${styles['file-tree--fixed']}`;
                }

                return styles['file-tree'];
            },
            [
                isOpened,
                windowWidth
            ]
        );

        const blockViewHandler = useCallback(
            async () => {
                if (!viewedUser?.email) return;

                if (!loggedInUser?.isPremium) {
                    setIsPremiumModalOpen(true);

                    return;
                }

                notification.show();

                try {
                    await dispatch(toggleUserIsViewBlocked(viewedUser.email)).unwrap();
                } catch (error) {
                    console.error(error);
                }

            },
            [
                dispatch,
                viewedUser,
                notification,
                loggedInUser,
                setIsPremiumModalOpen
            ]
        );

        const handleCreateRootFolder = useCallback(
            () => {
                if (authStatus === 'authenticated') {
                    handleOpenModalByReason(
                        {
                            reason: ActionType.AddRootFolder,
                            id: null,
                            title: "Add root folder",
                        }
                    );
                } else {
                    setIsLoginModalOpen(true);
                }

            },
            [
                authStatus,
                handleOpenModalByReason,
                setIsLoginModalOpen
            ]
        );

        const isBanned = !!viewedUser?.banned;

        const canView = isUserCanView(
            viewedUser,
            loggedInUser
        );

        const canEdit =
            !isBanned &&
            isUserCanEdit(
                authStatus === 'authenticated',
                viewedUserEmail,
                viewedUser,
                loggedInUser
            );

        const showHeader = isUserEqualsLoggedIn(
            viewedUserEmail,
            authStatus === 'authenticated',
            viewedUser
        );

        return (
            <div
                className={fileTreeStyles}
                ref={fileTreeRef}
            >
                {
                    notification.visible && (
                        <div
                            className={`${commonStyles.common__notification} ${notification.closing
                                ? commonStyles['common__notification--closing']
                                : ''
                            }`}
                            key={notification.id}
                            onClick={notification.close}
                        >
                            You
                            {viewedUser?.isViewBlocked
                                ? 'blocked'
                                : 'unblocked'
                            }
                            files for view
                        </div>
                    )}

                <div className={styles['file-tree__content']}>
                    {
                        (
                            isViewedUserLoading
                            || areFilesLoading
                            || authStatus === 'loading'
                        )
                            ? <FileTreeSkeleton/>
                            : (
                                <>
                                    {
                                        showHeader && (
                                            <div className={styles['file-tree__header']}>
                                                <div className={styles['file-tree__top']}>
                                                    <div className={styles['file-tree__user']}>
                                                        {viewedUser?.name}
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

                                    {
                                        isBanned &&
                                        <div className={styles['file-tree__view']}>
                                            This user has been banned
                                        </div>
                                    }

                                    {
                                        (!isBanned && !canView) &&
                                        <div className={styles['file-tree__view']}>
                                            User blocked his files for view
                                        </div>
                                    }

                                    {
                                        canEdit && (
                                            <div className={styles['file-tree__buttons']}>
                                                <div
                                                    className={styles['file-tree__button-create']}
                                                    onClick={handleCreateRootFolder}
                                                >
                                                    Create a root folder
                                                </div>

                                                {
                                                    authStatus === 'authenticated' && (
                                                        <div
                                                            className={`
                                                                ${styles['file-tree__button-block']}
                                                                ${!loggedInUser?.isPremium
                                                                ? styles['file-tree__button-block--premium']
                                                                : ''
                                                            }
`}
                                                            title={
                                                                viewedUser?.isViewBlocked
                                                                    ? 'Unblock view for other users'
                                                                    : 'Block view for other users'
                                                            }
                                                            onClick={blockViewHandler}
                                                        >
                                                            <LockSvg/>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        )}

                                    {
                                        canEdit && (
                                            <div className={styles['file-tree__usage']}>
                                                <div className={styles['file-tree__usage-text']}>
                                                    {
                                                        viewedUser?.isPremium
                                                            ? `${viewedUser?.amountOfFiles ?? 0} files`
                                                            : `${viewedUser?.amountOfFiles ?? 0} / 20 files`
                                                    }
                                                </div>

                                                <div className={styles['file-tree__usage-bar']}>
                                                    <div
                                                        className={`
                                                            ${styles['file-tree__usage-fill']}
                                                            ${isWarning
                                                            ? styles['file-tree__usage-fill--warning']
                                                            : ''
                                                        }`}
                                                        style={
                                                            {
                                                                width: viewedUser?.isPremium
                                                                    ? '100%'
                                                                    : `${Math.min(
                                                                        ((viewedUser?.amountOfFiles ?? 0) / 20) * 100,
                                                                        100
                                                                    )}%`
                                                            }
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        )}

                                    {
                                        (viewedUser && !isBanned && canView) && (
                                            <div className={styles['file-tree__files']}>
                                                <FileList
                                                    windowWidth={windowWidth}
                                                    viewedUserEmail={viewedUserEmail}
                                                />
                                            </div>
                                        )
                                    }
                                </>
                            )
                    }
                </div>

                {viewedUser?.isPremium ? (
                    <div className={styles['file-tree__premium-active']}>
                        <span>PREMIUM</span>

                        <span className={styles['file-tree__premium-badge']}>
                            ACTIVE
                        </span>
                    </div>
                ) : (
                    <div
                        className={`${commonStyles.premium} ${styles.premium}`}
                        onClick={
                            () => setIsPremiumModalOpen(true)
                        }
                    >
                        Upgrade
                    </div>
                )}
            </div>
        );

    }, (prev, next) =>
        prev.isOpened === next.isOpened &&
        prev.viewedUserEmail === next.viewedUserEmail
);

export default FileTree;