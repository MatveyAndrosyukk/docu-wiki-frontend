import React, {FC, useEffect, useMemo, useState} from 'react';
import Header from "./components/header/Header";
import styles from './MainPage.module.scss'
import FileTree from "./components/file-tree/FileTree";
import OpenedFile from "./components/opened-file/OpenedFile";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store";
import EditModal from "../../shared/ui/modal-windows/edit-modal/EditModal";
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
import {useResponsiveFileTree} from "../../shared/lib/hooks/useResponsiveFileTree";
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
import {ActionType} from "../../shared/ui/modal-windows/edit-modal/hooks/edit-modal-actions/types/ActionType";

interface MainPageProps {
    viewedUserEmail?: string | undefined;
    resetToken?: string | undefined;
    fileId?: string;
}

const MainPage: FC<MainPageProps> = ({viewedUserEmail, resetToken, fileId}) => {
    const [isFeedbackOpen, setIsFeedbackOpen] =
        useState(false);

    const {
        fileState,
        authState,
    } = useAppContext();

    const {
        authStatus
    } = useAuthContext();

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

    const {
        resetPasswordHandler,
        loginHandler,
    } = authState;

    const {
        actions,
        fileEditor,
    } = fileState;

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
    } = useResponsiveFileTree();

    useResetPasswordModal(
        resetToken,
        resetPasswordHandler.actions.openModal
    );

    useSetDocumentTitle(
        title ||
        "Docuwiki Studio"
    );

    useViewedUserLoader(currentUserEmail);

    useFetchFilesForViewedUser(
        viewedUser,
        loggedInUser
    );

    useEffect(() => {
            if (!fileId || !files?.length) return;

            if (openedFile?.id === Number(fileId)) return;

            const file = findFileById(
                files,
                Number(fileId)
            );

            if (file) {
                fileEditor.actions.tryToOpenFile(file.id)
            }
        },
        [fileId, files, dispatch, openedFile?.id, fileEditor.actions]);

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
                        actions.open(
                            {
                                reason: ActionType.AddRootFolder,
                                id: null,
                                title: "Add root folder",
                            }
                        );
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
        [
            authStatus,
            actions.open,
            actions,
            loginHandler.actions
        ]
    );

    return (
        <div className={styles['main']}>

            <Header
                setIsFeedbackOpen={setIsFeedbackOpen}
            />

            <div className={styles['container']}>

                <FileTree
                    isOpened={isOpened}
                    setIsOpened={setIsOpened}
                    viewedUserEmail={viewedUserEmail}
                />

                <OpenedFile
                    isFileLoading={isFileLoading}
                    isFileTreeOpened={isOpened}
                    setIsFileTreeOpened={setIsOpened}
                    viewedUserEmail={viewedUserEmail}
                    file={openedFile}
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

            <EditModal/>

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