import React, {FC, useEffect, useMemo} from 'react';
import Header from "./components/header/Header";
import styles from './MainPage.module.scss'
import FileTree from "./components/file-tree/FileTree";
import OpenedFile from "./components/opened-file/OpenedFile";
import {useSelector} from "react-redux";
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
import {useAppContext} from "../../shared/lib/hooks/useAppContext";
import {useResponsiveFileTree} from "../../shared/lib/hooks/useResponsiveFileTree";
import {useResetPasswordModal} from "../../shared/lib/hooks/useResetPasswordModal";
import {useDocumentTitle} from "../../shared/lib/hooks/useDocumentTitle";
import {useViewedUserLoader} from "../../shared/lib/hooks/useViewedUserLoader";
import {useFetchFilesForViewedUser} from "../../shared/lib/hooks/useFetchFilesForViewedUser";
import {ActionType} from "../../shared/lib/hooks/useModalActions";
import {useAuth} from "../../shared/lib/hooks/useAuth";

interface MainPageProps {
    viewedUserEmail?: string | undefined;
    resetToken?: string | undefined;
}

const MainPage: FC<MainPageProps> = ({viewedUserEmail, resetToken}) => {
    const {authState, fileState} = useAppContext();
    const {authStatus} = useAuth();

    const files = useSelector(selectFileTree);
    const loggedInUser = useSelector((state: RootState) => state.user.loggedInUser)
    const viewedUser = useSelector((state: RootState) => state.user.viewedUser)
    const openedFile = useSelector(selectOpenedFile);

    const {setIsResetPasswordModalOpened, setIsLoginModalOpen} = authState
    const {handleOpenModalByReason} = fileState;


    const currentUserEmail = viewedUserEmail ?? loggedInUser?.email ?? null;

    const title = useMemo(() => {
        if (openedFile) return findPathToFile(files, openedFile.id)?.join('/') ?? '';
        return loggedInUser ? "Docuwiki Workspace" : "Docuwiki Studio";
    }, [openedFile, files, loggedInUser]);

    const {isOpened, setIsOpened} = useResponsiveFileTree();

    useResetPasswordModal(resetToken, setIsResetPasswordModalOpened);
    useDocumentTitle(title || "Docuwiki Studio");
    useViewedUserLoader(currentUserEmail);
    useFetchFilesForViewedUser(viewedUser, loggedInUser);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'p' || e.key.toLowerCase() === 'з')) {
                e.preventDefault();

                if (authStatus === 'authenticated') {
                    handleOpenModalByReason({
                        reason: ActionType.AddRootFolder,
                        id: null,
                        title: "Add root folder",
                    });
                } else {
                    setIsLoginModalOpen(true);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [authStatus, handleOpenModalByReason, setIsLoginModalOpen]);

    return (
        <div className={styles['main']}>
            <Header/>
            <div className={styles['container']}>
                <FileTree
                    isOpened={isOpened}
                    setIsOpened={setIsOpened}
                    viewedUserEmail={viewedUserEmail}
                />
                <OpenedFile
                    isFileTreeOpened={isOpened}
                    setIsFileTreeOpened={setIsOpened}
                    viewedUserEmail={viewedUserEmail}
                    file={openedFile}/>
            </div>

            {isOpened && window.innerWidth < 1270 && (
                <div className={styles.overlay} onClick={() => setIsOpened(false)}/>
            )}

            <EditModal/>
            <DeleteModal/>
            <LoginModal/>
            <EnterEmailModal/>
            <ResetPasswordModal resetToken={resetToken}/>
            {isUserOwner(loggedInUser) && <BanModal/>}
        </div>
    );
};

export default MainPage;