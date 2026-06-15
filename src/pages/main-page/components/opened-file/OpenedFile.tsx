import React, {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState} from 'react'
import styles from './OpenedFile.module.scss'
import emptyStyles from '../../../../shared/ui/empty-file/EmplyFile.module.scss'
import {ReactComponent as BurgerSvg} from './images/empty-file-burger.svg'
import {parseFileTextToHTML} from '../../../../shared/lib/utils/parseFile'
import EditMode from './components/edit-mode/EditMode'
import {useNavigate} from "react-router-dom";
import EmptyFile from "../../../../shared/ui/empty-file/EmptyFile";
import OpenedFileHeader from "./components/opened-file-header/OpenedFileHeader";
import {useSelector} from "react-redux";
import {UiFile} from "../../../../store/types/UiFile";
import {selectFileTree} from "../../../../store/selectors/selectFileTree";
import {useFileLikes} from "../../../../shared/lib/hooks/useFileLikes";
import {RootState} from "../../../../store";
import {useAuth} from "../../../../shared/lib/hooks/useAuth";
import {useAppContext} from "../../../../shared/lib/hooks/useAppContext";
import {isUserCanEdit} from "../../../../shared/lib/utils/permissions-utils/isUserCanEdit";
import {formatDate} from "./utils/formatDate";

interface OpenedFileProps {
    file?: UiFile | null
    viewedUserEmail: string | undefined
    isFileTreeOpened: boolean
    setIsFileTreeOpened: Dispatch<SetStateAction<boolean>>
    isFileLoading: boolean
}

const OpenedFile: React.FC<OpenedFileProps> = (
    {
        file = null,
        viewedUserEmail,
        isFileTreeOpened,
        setIsFileTreeOpened,
        isFileLoading
    }) => {
    const [openedImage, setOpenedImage] = useState<string | null>(null)
    const [isBurgerMenuOpened, setIsBurgerMenuOpened] = useState(false)
    const [wasInitialized, setWasInitialized] = useState(false);

    const {fileState} = useAppContext();
    const {authStatus} = useAuth();
    const {isLiked, likes, toggleLike} = useFileLikes({fileId: file?.id as number});

    const files = useSelector(selectFileTree)
    const viewedUser = useSelector((state: RootState) => state.user.viewedUser);
    const loggedInUser = useSelector((state: RootState) => state.user.loggedInUser);
    const pendingImages = useSelector(
        (state: RootState) => state.fileUi.pendingImages
    );

    const navigate = useNavigate()

    const {isEditing, setIsEditing, handleOpenDeleteModal} = fileState

    useEffect(() => {
        if (openedImage) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [openedImage]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpenedImage(null);
            }
        };

        if (openedImage) {
            window.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [openedImage]);

    const handleOpenImage = useCallback((imageUrl: string) => {
        setOpenedImage(imageUrl)
    }, []);

    const parseFileTextToHTMLMemo = useCallback(
        (content: string,
         onImageClick: (url: string) => void,
         isFileTreeOpened: boolean) =>
            parseFileTextToHTML(content, onImageClick, isFileTreeOpened, pendingImages),
        [pendingImages]
    );

    const contentElements = useMemo(() => {
        if (!file?.content) return [];
        return parseFileTextToHTML(file.content, handleOpenImage, isFileTreeOpened, pendingImages);
    }, [file?.content, handleOpenImage, isFileTreeOpened, pendingImages]);

    const handleGoToUsersPage = useCallback((user: string | null) => {
        return navigate(`/${encodeURIComponent(user as string)}`)
    }, [navigate])

    const handleOpenEditionMode = useCallback(() => {
        setIsEditing(true);
        setIsBurgerMenuOpened(false);
    }, [setIsEditing])

    const handleDeleteFile = useCallback((file: UiFile) => {
        handleOpenDeleteModal(file, viewedUser)
        setIsBurgerMenuOpened(false);
    }, [handleOpenDeleteModal, viewedUser])

    useEffect(() => {
        setWasInitialized(false);
    }, [file?.id]);

    useEffect(() => {
        if (!file || wasInitialized) return;

        const isEmpty = !file.content || file.content.trim() === '';

        let isCanEdit = isUserCanEdit(authStatus === 'authenticated', viewedUserEmail, viewedUser, loggedInUser);

        if (isEmpty && isCanEdit) {
            setIsEditing(true);
        }

        setWasInitialized(true);
    }, [file, wasInitialized, setIsEditing, authStatus, viewedUserEmail, viewedUser, loggedInUser]);

    if (!file) {
        return (
            <EmptyFile
                isFileLoading={isFileLoading}
                isFileTreeOpened={isFileTreeOpened}
                setIsFileTreeOpened={setIsFileTreeOpened}/>
        )
    }

    console.log(formatDate(file.createdAt));

    return (
        <div className={styles['opened-file']}>
            <OpenedFileHeader
                file={file}
                isLiked={isLiked}
                likes={likes}
                viewedUser={viewedUser}
                loggedInUser={loggedInUser}
                files={files}
                isBurgerMenuOpened={isBurgerMenuOpened}
                isEditing={isEditing}
                isLoggedIn={authStatus === 'authenticated'}
                emailParam={viewedUserEmail}
                setIsEditing={setIsEditing}
                setIsBurgerMenuOpened={setIsBurgerMenuOpened}
                onTryToLikeFile={toggleLike}
                onOpenEditionMode={handleOpenEditionMode}
                onDeleteFile={handleDeleteFile}
                onOpenDeleteModal={handleOpenDeleteModal}
            />

            {openedImage && (
                <div
                    className={styles['opened-image__background']}
                    onClick={() => setOpenedImage(null)}
                >
                    <button
                        className={styles['opened-image__close']}
                        onClick={(e) => {
                            e.stopPropagation();
                            setOpenedImage(null);
                        }}
                    >
                        ✕
                    </button>

                    <img
                        src={openedImage}
                        alt="Opened"
                        className={styles['opened-image__image']}
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}

            {isEditing
                ? <EditMode file={file} parseFileTextToHTML={parseFileTextToHTMLMemo} onImageClick={handleOpenImage}
                            isFileTreeOpened={isFileTreeOpened}/>
                : <div className={styles['opened-file__content']}>{contentElements}</div>
            }

            <div className={styles['opened-file__footer']}>
                Last edited {formatDate(file.updatedAt)} -

                <span
                    onClick={() => handleGoToUsersPage(file.lastEditor as string)}
                    className={styles['footer__editor']}
                >
                    {file.lastEditor}
                </span>
            </div>

            <div
                style={{display: isFileTreeOpened ? 'none' : 'flex'}}
                className={emptyStyles['file-tree']}
                onClick={e => {
                    e.stopPropagation();
                    setIsFileTreeOpened(!isFileTreeOpened);
                }}
            >
                <BurgerSvg className={emptyStyles['file-tree-image']}/>
            </div>
        </div>
    );
}

export default OpenedFile