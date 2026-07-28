import React, {Dispatch, FC, SetStateAction, useCallback, useMemo, useRef} from 'react';
import styles from './FileTree.module.scss'
import commonStyles from '../../../../shared/assets/styles/Common.module.scss'
import {ReactComponent as LockSvg} from './images/fileTree-lock.svg'
import {ReactComponent as BanSvg} from './images/fileTree-ban.svg'
import FileList from "./components/file-list/FileList";
import {AppDispatch, RootState} from "../../../../store";
import {useDispatch, useSelector} from "react-redux";
import {toggleUserIsViewBlocked} from "../../../../store/thunks/user/toggleUserIsViewBlocked";
import {isUserCanEdit} from "../../../../shared/lib/utils/permissions-utils/isUserCanEdit";
import {isUserCanView} from "../../../../shared/lib/utils/permissions-utils/isUserCanView";
import {isUserEqualsLoggedIn} from "../../../../shared/lib/utils/permissions-utils/isUserEqualsLoggedIn";
import {isUserOwner} from "../../../../shared/lib/utils/permissions-utils/isUserOwner";
import FileTreeSkeleton from "../../../../shared/ui/file-tree-skeleton/FileTreeSkeleton";
import {useAuthContext} from "../../../../context/auth-context/hooks/useAuthContext";
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";
import {useWindowWidth} from "../../../../shared/lib/hooks/useWindowWidth";
import {useNotificationHandler} from "../../../../shared/lib/hooks/use-notification-handler/useNotificationHandler";
import {useElementOutsideEvent} from "../../../../shared/lib/hooks/useElementOutsideEvent";
import {isUserPremiumActive} from "../../../../shared/lib/utils/permissions-utils/isUserPremiumActive";

interface FileTreeProps {
    viewedUserEmail: string | undefined;

    isFileTreeOpened: boolean;

    setIsFileTreeOpened: Dispatch<SetStateAction<boolean>>;
}

const FileTree: FC<FileTreeProps> = React.memo(
    (
        {
            viewedUserEmail,
            isFileTreeOpened,
            setIsFileTreeOpened,
        }
    ) => {

        const reduxDispatch = useDispatch<AppDispatch>();

        const {
            filesHandler,
            banHandler,
            premiumHandler,
            authHandler,
        } = useAppContext();

        const {
            authStatus
        } = useAuthContext();

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

        const isViewedUserPremium =
            isUserPremiumActive(
                viewedUser
            );

        const isLoggedInUserPremium =
            isUserPremiumActive(
                loggedInUser
            );

        const {loginHandler} = authHandler;

        const {setIsPremiumModalOpen} = premiumHandler;

        const fileTreeRef = useRef<HTMLDivElement>(null);

        const windowWidth = useWindowWidth();

        const notificationHandler = useNotificationHandler();

        useElementOutsideEvent(
            {
                ref: fileTreeRef,
                eventType: "dblclick",
                handler: () => setIsFileTreeOpened(true),
                enabled: (isFileTreeOpened && windowWidth < 1270)
            }
        );

        const filesCount =
            viewedUser?.amountOfFiles ??
            0;

        const isWarning =
            !isViewedUserPremium &&
            filesCount >= 15;

        const fileTreeStyles = useMemo(
            () => {

                if (!isFileTreeOpened) return styles['file-tree-closed'];

                if (windowWidth < 1270) {
                    return `${styles['file-tree']} ${styles['file-tree--fixed']}`;
                }

                return styles['file-tree'];
            },
            [
                isFileTreeOpened,
                windowWidth
            ]
        );

        const blockViewHandler = useCallback(
            async () => {

                if (!loggedInUser) {
                    loginHandler.actions.openModal();

                    return;
                }

                if (!viewedUser?.email) return;

                if (!isLoggedInUserPremium) {

                    setIsPremiumModalOpen(true);

                    return;
                }

                notificationHandler.actions.show();

                try {

                    await reduxDispatch(
                        toggleUserIsViewBlocked(
                            viewedUser.email
                        )
                    ).unwrap();

                } catch (error) {

                    console.error(error);
                }

            },
            [
                reduxDispatch,
                viewedUser,
                notificationHandler,
                isLoggedInUserPremium,
                setIsPremiumModalOpen
            ]
        );

        const handleCreateRootFolder = useCallback(
            () => {
                if (authStatus === 'authenticated') {

                    filesHandler.contextMenuHandler.actions.addRootFolder();
                } else {

                    loginHandler.actions.openModal();
                }

            },
            [
                authStatus,
                filesHandler.contextMenuHandler.actions,
                loginHandler.actions
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

        const isNotOwnProfile = isUserEqualsLoggedIn(
            viewedUserEmail,
            authStatus === 'authenticated',
            viewedUser
        );

        const handleUpgradeClick = () => {
            if (!loggedInUser) {
                loginHandler.actions.openModal();

                return;
            }

            setIsPremiumModalOpen(true);
        };

        return (
            <div
                className={
                    fileTreeStyles
                }

                ref={
                    fileTreeRef
                }
            >
                {

                    notificationHandler.state.visible && (

                        <div
                            className={
                                `${commonStyles.common__notification} ${notificationHandler.state.closing
                                    ? commonStyles['common__notification--closing']
                                    : ''
                                }`
                            }

                            key={
                                notificationHandler.state.id
                            }

                            onClick={
                                notificationHandler.actions.close
                            }
                        >
                            You

                            {
                                viewedUser?.isViewBlocked
                                    ? 'blocked'
                                    : 'unblocked'
                            }

                            files for view
                        </div>
                    )
                }

                <div
                    className={
                        styles['file-tree__content']
                    }
                >

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

                                        isNotOwnProfile && (
                                            <div
                                                className={
                                                    styles['file-tree__header']
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles['file-tree__top']
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            styles['file-tree__user']
                                                        }
                                                    >
                                                        {viewedUser?.name}
                                                    </div>

                                                    {
                                                        isUserOwner(loggedInUser) && (
                                                            <div
                                                                className={
                                                                    styles['file-tree__ban']
                                                                }

                                                                onClick={
                                                                    () => banHandler.actions.open()
                                                                }
                                                            >
                                                                <BanSvg/>
                                                            </div>
                                                        )
                                                    }
                                                </div>

                                                <div
                                                    className={
                                                        styles['file-tree__line']
                                                    }
                                                />
                                            </div>
                                        )}

                                    {

                                        isBanned &&
                                        <div className={
                                            styles['file-tree__view']
                                        }
                                        >
                                            This user has been banned
                                        </div>
                                    }

                                    {

                                        (!isBanned && !canView) &&
                                        <div
                                            className={
                                                styles['file-tree__view']
                                            }
                                        >
                                            User blocked his files for view
                                        </div>
                                    }

                                    {

                                        canEdit && (
                                            <div
                                                className={
                                                    styles['file-tree__buttons']
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles['file-tree__button-create']
                                                    }

                                                    onClick={
                                                        handleCreateRootFolder
                                                    }
                                                >
                                                    Create a root folder
                                                </div>

                                                {

                                                    authStatus === 'authenticated' && (
                                                            <div
                                                                className={
                                                                    `${styles['file-tree__button-block']}
                                                                    ${!isLoggedInUserPremium
                                                                        ? styles['file-tree__button-block--premium']
                                                                        : ''
                                                                    }`
                                                                }

                                                                title={
                                                                    viewedUser?.isViewBlocked
                                                                        ? 'Unblock view for other users'
                                                                        : 'Block view for other users'
                                                                }

                                                                onClick={
                                                                    blockViewHandler
                                                                }
                                                            >
                                                                <LockSvg/>
                                                            </div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }

                                    {

                                        canEdit && (
                                            <div
                                                className={
                                                    styles['file-tree__usage']
                                                }
                                            >
                                                <div
                                                    className={
                                                        styles['file-tree__usage-text']
                                                    }
                                                >
                                                    {

                                                        isViewedUserPremium
                                                            ? `${viewedUser?.amountOfFiles ?? 0} files`
                                                            : `${viewedUser?.amountOfFiles ?? 0} / 20 files`
                                                    }
                                                </div>

                                                <div
                                                    className={
                                                        styles['file-tree__usage-bar']
                                                    }
                                                >
                                                    <div
                                                        className={`
                                                        ${styles['file-tree__usage-fill']}
                                                        ${isWarning
                                                            ? styles['file-tree__usage-fill--warning']
                                                            : ''}
                                                                `}

                                                        style={
                                                            {
                                                                width: isViewedUserPremium
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
                                        )
                                    }

                                    {

                                        (
                                            viewedUser
                                            && !isBanned
                                            && canView) &&
                                        (
                                            <div className={
                                                styles['file-tree__files']
                                            }
                                            >
                                                <FileList
                                                    viewedUserEmail={
                                                        viewedUserEmail
                                                    }
                                                />
                                            </div>
                                        )
                                    }
                                </>
                            )
                    }
                </div>

                {
                    isViewedUserPremium ? (

                        <div
                            className={
                                styles['file-tree__premium-active']
                            }
                        >
                        <span>
                            PREMIUM
                        </span>

                            <span
                                className={
                                    styles['file-tree__premium-badge']
                                }
                            >
                            ACTIVE
                        </span>
                        </div>
                    ) : !isNotOwnProfile ? (

                        <div
                            className={
                                `${commonStyles.premium} ${styles.premium}`
                            }

                            onClick={
                                handleUpgradeClick
                            }
                        >
                            Upgrade
                        </div>

                    ) : (

                        <div
                            className={
                                `${styles['file-tree__premium-active']}
                                ${styles['file-tree__premium-active--inactive']}`
                            }
                        >
                            <span>
                            PREMIUM
                            </span>

                            <span
                                className={
                                    styles['file-tree__premium-badge']
                                }
                            >
                            INACTIVE
                            </span>
                        </div>
                    )
                }
            </div>
        );

    }, (
        prev,
        next
    ) =>
        prev.isFileTreeOpened === next.isFileTreeOpened &&
        prev.viewedUserEmail === next.viewedUserEmail
);

export default FileTree;