import React, {FC, useEffect, useMemo, useState} from 'react';
import Header from "./components/header/Header";
import styles from './MainPage.module.scss'
import FileTree from "./components/file-tree/FileTree";
import OpenedFile from "./components/opened-file/OpenedFile";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import ActionsModal from "../../shared/ui/modal-windows/actions-modal/ActionsModal";
import DeleteModal from "../../shared/ui/modal-windows/delete-modal/DeleteModal";
import LoginModal from "../../shared/ui/modal-windows/login-modal/LoginModal";
import EnterEmailModal from "../../shared/ui/modal-windows/enter-email-modal/EnterEmailModal";
import ResetPasswordModal from "../../shared/ui/modal-windows/reset-password-modal/ResetPasswordModal";
import {isUserOwner} from "../../shared/lib/utils/permissions-utils/isUserOwner";
import BanModal from "../../shared/ui/modal-windows/ban-modal/BanModal";
import findPathToFile from "../../shared/lib/utils/findFilePath";
import {selectOpenedFile} from "../../store/selectors/selectOpenedFile";
import {selectFileTree} from "../../store/selectors/selectFileTree";
import {useAppContext} from "../../context/app-context/hooks/useAppContext";
import {useFileTreeVisionState} from "../../shared/lib/hooks/useFileTreeVisionState";
import {useResetPasswordModal} from "../../shared/ui/modal-windows/reset-password-modal/hooks/useResetPasswordModal";
import {useSetDocumentTitle} from "../../shared/lib/hooks/useSetDocumentTitle";
import {useViewedUserLoader} from "../../shared/lib/hooks/useViewedUserLoader";
import {useFetchFilesForViewedUser} from "../../shared/lib/hooks/useFetchFilesForViewedUser";
import {useAuthContext} from "../../context/auth-context/hooks/useAuthContext";
import {findFileById} from "../../store/utils/fileTreeActionUtils";
import FeedbackButton from "../../shared/ui/feedback-button/FeedbackButton";
import FeedbackModal from "../../shared/ui/modal-windows/feedback-modal/FeedbackModal";
import GlobalNotification from "../../shared/ui/global-notification/GlobalNotification";
import {useWindowWidth} from "../../shared/lib/hooks/useWindowWidth";
import PremiumModal from "../../shared/ui/modal-windows/premium-modal/PremiumModal";

interface MainPageProps {
    viewedUserEmail?: string | undefined;
    resetToken?: string | undefined;
    fileId?: string;
}

const MainPage: FC<MainPageProps> = ({viewedUserEmail, resetToken, fileId}) => {
    const [isFeedbackOpen, setIsFeedbackOpen] =
        useState(false);

    const {
        filesHandler,
        authHandler,
        editorHandler,
    } = useAppContext();

    const {
        authStatus
    } = useAuthContext();
    
    const {
        contextMenuHandler,
    } = filesHandler;

    const {
        editModeHandler
    } = editorHandler;

    const {
        resetPasswordHandler,
        loginHandler,
    } = authHandler;

    const dispatch = useDispatch();

    const width = useWindowWidth();

    const files = useSelector(selectFileTree);

    const openedFile = useSelector(selectOpenedFile);

    const loggedInUser = useSelector(
        (state: RootState) => state.user.loggedInUser
    );

    const viewedUser = useSelector(
        (state: RootState) => state.user.viewedUser
    );

    const isMobile = width < 1066;

    const currentUserEmail =
        viewedUserEmail ??
        loggedInUser?.email ??
        null;

    const isFileLoading =
        Boolean(fileId) && (!files || files.length === 0);

    const title = useMemo(() => {
        if (openedFile) return findPathToFile(
                files,
                openedFile.id
            )?.join('/') ??
            '';

        return loggedInUser ?
            "Docuwiki Workspace" :
            "Docuwiki Studio";

    }, [openedFile, files, loggedInUser]);

    const {
        isOpened,
        setIsOpened
    } = useFileTreeVisionState();

    useResetPasswordModal(
        resetToken,
        resetPasswordHandler.actions.openModal
    );

    useSetDocumentTitle(
        title ||
        "Docuwiki Studio"
    );

    useViewedUserLoader(
        {
            email: currentUserEmail,
        }
    );

    useFetchFilesForViewedUser(
        {
            viewedUser,
            loggedInUser
        }
    );

    useEffect(() => {
            if (!fileId || !files?.length) return;

            if (openedFile?.id === Number(fileId)) return;

            const file = findFileById(
                files,
                Number(fileId)
            );

            if (file) {
                editModeHandler.actions.tryToOpenFile(
                    file.id
                );
            }
        },
        [fileId, files, dispatch, openedFile?.id, editModeHandler.actions]);

    useEffect(() => {
            const handleKeyDown = (
                e: KeyboardEvent
            ) => {
                if (
                    (e.ctrlKey || e.metaKey) &&
                    (e.key.toLowerCase() === 'p' ||
                        e.key.toLowerCase() === 'з')
                ) {
                    e.preventDefault();

                    if (authStatus === 'authenticated') {
                        contextMenuHandler.actions.addRootFolder()
                    } else {
                        loginHandler.actions.openModal();
                    }
                }
            };

            window.addEventListener(
                'keydown',
                handleKeyDown
            );

            return () => window.removeEventListener(
                'keydown',
                handleKeyDown
            );
        },
        [authStatus, loginHandler.actions, contextMenuHandler.actions]
    );

    return (
        <div className={styles['main']}>

            <Header
                setIsFeedbackOpen={setIsFeedbackOpen}
            />

            <div className={styles['container']}>

                <FileTree
                    isFileTreeOpened={isOpened}
                    setIsFileTreeOpened={setIsOpened}
                    viewedUserEmail={viewedUserEmail}
                />

                <OpenedFile
                    isFileLoading={isFileLoading}
                    isFileTreeOpened={isOpened}
                    setIsFileTreeOpened={setIsOpened}
                    viewedUserEmail={viewedUserEmail}
                />

            </div>

            {
                (isOpened && window.innerWidth < 1270) &&
                (
                    <div
                        className={styles.overlay}
                        onClick={() => setIsOpened(false)}
                    />

                )
            }

            {
                !isMobile &&
                <FeedbackButton
                    onClick={() => setIsFeedbackOpen(true)}
                />
            }

            <FeedbackModal
                isOpen={isFeedbackOpen}
                onClose={() => setIsFeedbackOpen(false)}
                userEmail={loggedInUser?.email}
            />

            <ActionsModal/>

            <DeleteModal/>

            <LoginModal/>

            <EnterEmailModal/>

            <ResetPasswordModal
                resetToken={resetToken}
            />

            <PremiumModal/>

            <GlobalNotification/>

            {
                isUserOwner(loggedInUser) &&
                <BanModal/>
            }

        </div>
    );
};

export default MainPage;