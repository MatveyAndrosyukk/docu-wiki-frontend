import React, {Dispatch, SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from 'react'
import styles from './OpenedFile.module.scss'
import emptyStyles from '../../../../shared/ui/empty-file/EmplyFile.module.scss'
import {ReactComponent as BurgerSvg} from './images/burger.svg'
import {ReactComponent as ReportSvg} from './images/report.svg'
import EditMode from './components/edit-mode/EditMode'
import {useNavigate} from "react-router-dom";
import EmptyFile from "../../../../shared/ui/empty-file/EmptyFile";
import OpenedFileHeader from "./components/opened-file-header/OpenedFileHeader";
import {useSelector} from "react-redux";
import {UiFile} from "../../../../store/types/UiFile";
import {RootState} from "../../../../store";
import {useAuthContext} from "../../../../context/auth-context/hooks/useAuthContext";
import {useAppContext} from "../../../../context/app-context/hooks/useAppContext";
import {isUserCanEdit} from "../../../../shared/lib/utils/permissions-utils/isUserCanEdit";
import {formatDate} from "./utils/formatDate";
import parseFileTextToHTML from "./utils/parse-file-content-utils/parseFileTextToHTML";
import {selectOpenedFile} from "../../../../store/selectors/selectOpenedFile";
import ReportModal from "../../../../shared/ui/modal-windows/report-modal/ReportModal";

interface Props {
    viewedUserEmail: string | undefined;

    isFileTreeOpened: boolean;

    setIsFileTreeOpened: Dispatch<SetStateAction<boolean>>;

    isFileLoading: boolean;
}

const OpenedFile: React.FC<Props> = (
    {
        viewedUserEmail,
        isFileTreeOpened,
        setIsFileTreeOpened,
        isFileLoading
    }) => {

    const [openedImage, setOpenedImage] = useState<
        string | null
    >(null);

    const [isBurgerMenuOpened, setIsBurgerMenuOpened] = useState(
        false
    );

    const [isReportModalOpen, setIsReportModalOpen] = useState(
        false
    );

    const [wasInitialized, setWasInitialized] = useState(
        false
    );

    const contentRef = useRef<
        HTMLDivElement
    >(null);

    const {
        filesHandler,
        editorHandler,
    } = useAppContext();

    const {
        authStatus
    } = useAuthContext();

    const openedFile = useSelector(
        selectOpenedFile
    );

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

    useEffect(
        () => {

            document.body.style.overflow = openedImage ? 'hidden' : '';

            return () => {
                document.body.style.overflow = '';
            };
        },
        [
            openedImage
        ]
    );

    useEffect(
        () => {

            if (!contentRef.current) return;

            const scrollbarWidth =
                contentRef.current.offsetWidth -
                contentRef.current.clientWidth;

            contentRef.current.parentElement?.style.setProperty(
                '--scrollbar-width',
                `${scrollbarWidth}px`
            );
        },
        [
            openedFile
        ]
    );

    useEffect(
        () => {

            const handleKeyDown = (
                e: KeyboardEvent
            ) => {

                if (e.key === 'Escape') {

                    setOpenedImage(null);
                }
            };

            if (openedImage) {

                window.addEventListener(
                    'keydown',
                    handleKeyDown
                );
            }

            return () => {

                window.removeEventListener(
                    'keydown',
                    handleKeyDown
                );
            };
        },
        [
            openedImage
        ]
    );

    const handleOpenImage = useCallback(
        (
            imageUrl: string
        ) => {

            setOpenedImage(
                imageUrl
            )
        },
        []
    );

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
        [
            pendingImages
        ]
    );

    const contentElements = useMemo(
        () => {

            if (!openedFile?.content) return [];

            return parseFileTextToHTML(
                openedFile.content,
                handleOpenImage,
                isFileTreeOpened,
                pendingImages
            );
        },
        [
            openedFile?.content,
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
        },
        [
            navigate
        ]
    );

    const handleOpenEditionMode = useCallback(
        () => {

            editorHandler.editModeHandler.actions.setIsEditing(
                true
            );

            setIsBurgerMenuOpened(false);
        }, [
            editorHandler.editModeHandler.actions
        ]
    );

    const handleDeleteFile = useCallback(
        (
            file: UiFile
        ) => {

            filesHandler.fileRemoveHandler.actions.open(
                file,
                viewedUser
            );

            setIsBurgerMenuOpened(false);
        },
        [
            filesHandler.fileRemoveHandler.actions,
            viewedUser
        ]
    );

    useEffect(
        () => {

            setWasInitialized(false);
        },
        [
            openedFile?.id
        ]
    );

    useEffect(
        () => {

            if (!openedFile ||
                wasInitialized)

                return;

            const isEmpty =
                !openedFile.content ||
                openedFile.content.trim() === '';

            let isCanEdit = isUserCanEdit(
                authStatus === 'authenticated',
                viewedUserEmail,
                viewedUser,
                loggedInUser
            );

            if (isEmpty &&
                isCanEdit) {

                editorHandler.editModeHandler.actions.setIsEditing(true);
            }

            setWasInitialized(true);
        },
        [
            openedFile,
            wasInitialized,
            authStatus,
            viewedUserEmail,
            viewedUser,
            loggedInUser,
            editorHandler.editModeHandler.actions
        ]
    );

    if (!openedFile) {

        return (

            <EmptyFile

                isFileLoading={
                    isFileLoading
                }

                isFileTreeOpened={
                    isFileTreeOpened
                }

                setIsFileTreeOpened={
                    setIsFileTreeOpened
                }
            />
        )
    }

    return (
        <div
            className={
                styles['opened-file']
            }
        >
            <OpenedFileHeader
                isBurgerMenuOpened={
                    isBurgerMenuOpened
                }

                emailParam={
                    viewedUserEmail
                }

                setIsBurgerMenuOpened={
                    setIsBurgerMenuOpened
                }

                onOpenEditionMode={
                    handleOpenEditionMode
                }

                onDeleteFile={
                    handleDeleteFile
                }
            />

            {

                openedImage && (

                    <div
                        className={
                            styles['opened-image__background']
                        }

                        onClick={
                            () => setOpenedImage(null)
                        }
                    >
                        <button
                            className={
                                styles['opened-image__close']
                            }

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
                            src={
                                openedImage
                            }

                            alt="Opened"

                            className={
                                styles['opened-image__image']
                            }

                            onClick={
                                e => e.stopPropagation()
                            }
                        />
                    </div>
                )
            }

            {
                editorHandler.editModeHandler.state.isEditing
                    ? <EditMode
                        file={
                            openedFile
                        }

                        parseFileTextToHTML={
                            parseFileTextToHTMLMemo
                        }

                        onImageClick={
                            handleOpenImage
                        }

                        isFileTreeOpened={
                            isFileTreeOpened
                        }
                    />
                    : <div
                        className={
                            styles['opened-file__content']
                        }

                        ref={
                            contentRef
                        }
                    >
                        {contentElements}
                    </div>
            }

            <div
                className={
                    styles['opened-file__footer']
                }
            >
                <div
                    className={
                        styles['last-editor']
                    }
                >
                    Last edited

                    {
                        " " +
                        formatDate(
                            openedFile.updatedAt
                        ) + " -"
                    }
                    <span
                        className={
                            styles['footer__editor']
                        }

                        onClick={
                            () => handleGoToUsersPage(
                                openedFile.lastEditor as string
                            )
                        }
                    >
                    {
                        openedFile.lastEditor
                    }
                </span>
                </div>
                <div
                    className={
                        styles['report-file']
                    }

                    onClick={
                        () => setIsReportModalOpen(
                            true
                        )
                    }
                >
                    <ReportSvg
                        className={
                            styles['report-file__icon']
                        }
                    />
                </div>
            </div>
            <div
                style={
                    {
                        display: isFileTreeOpened ? 'none' : 'flex'
                    }
                }

                className={
                    emptyStyles['file-tree']
                }

                onClick={
                    e => {
                        e.stopPropagation();

                        setIsFileTreeOpened(
                            !isFileTreeOpened
                        );
                    }
                }
            >
                <BurgerSvg
                    className={
                        emptyStyles['file-tree-image']
                    }
                />
            </div>

            <ReportModal
                isOpen={
                    isReportModalOpen
                }

                onClose={

                    () => setIsReportModalOpen(
                        false
                    )

                }

                fileId={
                    openedFile.id
                }

                userEmail={
                    loggedInUser?.email
                }
            />
        </div>
    );
}

export default OpenedFile