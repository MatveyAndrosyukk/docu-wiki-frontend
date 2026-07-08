import React, {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import styles from './OpenedFile.module.scss'
import emptyStyles from '../../../../shared/ui/empty-file/EmplyFile.module.scss'
import {ReactComponent as BurgerSvg} from './images/empty-file-burger.svg'
import EditMode from './components/edit-mode/EditMode'
import {useNavigate} from "react-router-dom";
import EmptyFile from "../../../../shared/ui/empty-file/EmptyFile";
import OpenedFileHeader from "./components/opened-file-header/OpenedFileHeader";
import {useSelector} from "react-redux";
import {UiFile} from "../../../../store/types/UiFile";
import {selectFileTree} from "../../../../store/selectors/selectFileTree";
import {useFileLikes} from "../../../../shared/lib/hooks/useFileLikes";
import {RootState} from "../../../../store";
import {useAuthContext} from "../../../../context/auth-context/hooks/useAuthContext";
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";
import {isUserCanEdit} from "../../../../shared/lib/utils/permissions-utils/isUserCanEdit";
import {formatDate} from "./utils/formatDate";
import parseFileTextToHTML from "./utils/parse-file-content-utils/parseFileTextToHTML";

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
    const [openedImage, setOpenedImage] =
        useState<string | null>(null);

    const [isBurgerMenuOpened, setIsBurgerMenuOpened] =
        useState(false);

    const [wasInitialized, setWasInitialized] =
        useState(false);

    const contentRef =
        useRef<HTMLDivElement>(null);

    const {
        fileState,
    } = useAppContext();

    const {authStatus} = useAuthContext();

    const {
        isLiked,
        likes,
        toggleLike
    } = useFileLikes(
        {
            fileId: file?.id as number
        }
    );

    const files = useSelector(selectFileTree)

    const viewedUser = useSelector(
        (state: RootState) => state.user.viewedUser
    );

    const loggedInUser = useSelector(
        (state: RootState) => state.user.loggedInUser
    );

    const pendingImages = useSelector(
        (state: RootState) => state.fileUi.pendingImages
    );

    const navigate = useNavigate();

    const {
        fileEditor,
        deleteModal
    } = fileState;

    useEffect(() => {
        document.body.style.overflow = openedImage ? 'hidden' : '';

        return () => {
            document.body.style.overflow = '';
        };
    }, [openedImage]);

    useEffect(() => {
        if (!contentRef.current) return;

        const scrollbarWidth =
            contentRef.current.offsetWidth -
            contentRef.current.clientWidth;

        contentRef.current.parentElement?.style.setProperty(
            '--scrollbar-width',
            `${scrollbarWidth}px`
        );
    }, [file]);

    useEffect(() => {
        const handleKeyDown = (
            e: KeyboardEvent
        ) => {
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

    const handleOpenImage = useCallback(
        (
            imageUrl: string
        ) => {
            setOpenedImage(imageUrl)
        }, []);

    const parseFileTextToHTMLMemo = useCallback(
        (
            content: string,
            onImageClick: (url: string) => void,
            isFileTreeOpened: boolean
        ) =>
            parseFileTextToHTML(
                content,
                onImageClick,
                isFileTreeOpened,
                pendingImages
            ),
        [pendingImages]
    );

    const contentElements = useMemo(() => {
            if (!file?.content) return [];

            return parseFileTextToHTML(
                file.content,
                handleOpenImage,
                isFileTreeOpened,
                pendingImages
            );
        },
        [
            file?.content,
            handleOpenImage,
            isFileTreeOpened,
            pendingImages
        ]
    );

    const handleGoToUsersPage = useCallback(
        (
            user: string | null
        ) => {
            return navigate(
                `/${encodeURIComponent(user as string)}`
            );
        }, [navigate]);

    const handleOpenEditionMode = useCallback(
        () => {
            fileEditor.actions.setIsEditing(true);

            setIsBurgerMenuOpened(false);
        }, [fileEditor.actions]);

    const handleDeleteFile = useCallback(
        (
            file: UiFile
        ) => {
            deleteModal.actions.open(file, viewedUser)

            setIsBurgerMenuOpened(false);
        },
        [
            deleteModal.actions,
            viewedUser
        ]
    );

    useEffect(() => {
        setWasInitialized(false);
    }, [file?.id]);

    useEffect(
        () => {
            if (
                !file ||
                wasInitialized
            ) return;

            const isEmpty =
                !file.content ||
                file.content.trim() === '';

            let isCanEdit = isUserCanEdit(
                authStatus === 'authenticated',
                viewedUserEmail,
                viewedUser,
                loggedInUser
            );

            if (
                isEmpty &&
                isCanEdit
            ) {
                fileEditor.actions.setIsEditing(true);
            }

            setWasInitialized(true);
        },
        [file, wasInitialized, authStatus, viewedUserEmail, viewedUser, loggedInUser, fileEditor.actions]
    );

    if (!file) {
        return (
            <EmptyFile
                isFileLoading={isFileLoading}
                isFileTreeOpened={isFileTreeOpened}
                setIsFileTreeOpened={setIsFileTreeOpened}
            />
        )
    }

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
                isEditing={fileEditor.state.isEditing}
                isLoggedIn={authStatus === 'authenticated'}
                emailParam={viewedUserEmail}
                setIsEditing={fileEditor.actions.setIsEditing}
                setIsBurgerMenuOpened={setIsBurgerMenuOpened}
                onTryToLikeFile={toggleLike}
                onOpenEditionMode={handleOpenEditionMode}
                onDeleteFile={handleDeleteFile}
                onOpenDeleteModal={deleteModal.actions.open}
            />

            {
                openedImage && (
                    <div
                        className={styles['opened-image__background']}
                        onClick={() => setOpenedImage(null)}
                    >
                        <button
                            className={styles['opened-image__close']}
                            onClick={
                                (e) => {
                                    e.stopPropagation();

                                    setOpenedImage(null);
                                }
                            }
                        >
                            ✕
                        </button>

                        <img
                            src={openedImage}
                            alt="Opened"
                            className={styles['opened-image__image']}
                            onClick={
                                e => e.stopPropagation()
                            }
                        />
                    </div>
                )}

            {
                fileEditor.state.isEditing
                    ? <EditMode
                        file={file}
                        parseFileTextToHTML={parseFileTextToHTMLMemo}
                        onImageClick={handleOpenImage}
                        isFileTreeOpened={isFileTreeOpened}
                    />
                    : <div
                        className={styles['opened-file__content']}
                        ref={contentRef}
                    >
                        {contentElements}
                    </div>
            }

            <div className={styles['opened-file__footer']}>
                Last edited {formatDate(file.updatedAt)} -

                <span
                    className={styles['footer__editor']}
                    onClick={
                        () => handleGoToUsersPage(file.lastEditor as string)
                    }
                >
                    {file.lastEditor}
                </span>
            </div>

            <div
                style={
                    {
                        display: isFileTreeOpened ? 'none' : 'flex'
                    }
                }
                className={emptyStyles['file-tree']}
                onClick={
                    e => {
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