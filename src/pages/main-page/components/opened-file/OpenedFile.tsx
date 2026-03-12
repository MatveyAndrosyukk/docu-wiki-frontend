import React, {Dispatch, SetStateAction, useCallback, useMemo} from 'react'
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

interface OpenedFileProps {
    file?: UiFile | null
    emailParam: string | undefined
    isFileTreeOpened: boolean
    setIsFileTreeOpened: Dispatch<SetStateAction<boolean>>
}

const OpenedFile: React.FC<OpenedFileProps> = (
    {
        file = null,
        emailParam,
        isFileTreeOpened,
        setIsFileTreeOpened
    }) => {
    const navigate = useNavigate()

    const [openedImage, setOpenedImage] = React.useState<string | null>(null)
    const [isBurgerMenuOpened, setIsBurgerMenuOpened] = React.useState(false)

    const {fileState} = useAppContext();
    const {authStatus} = useAuth();
    const {isLiked, likes, toggleLike} = useFileLikes({fileId: file?.id as number});

    const files = useSelector(selectFileTree)
    const viewedUser = useSelector((state: RootState) => state.user.viewedUser);
    const loggedInUser = useSelector((state: RootState) => state.user.loggedInUser);
    const pendingImages = useSelector(
        (state: RootState) => state.fileUi.pendingImages
    );

    const {isEditing, setIsEditing, handleOpenDeleteModal} = fileState

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

    if (!file) {
        return (
            <EmptyFile
                isFileTreeOpened={isFileTreeOpened}
                setIsFileTreeOpened={setIsFileTreeOpened}/>
        )
    }

    return (
        <div className={styles['opened-file']}>
            <OpenedFileHeader {...{
                file,
                isLiked,
                likes,
                viewedUser,
                loggedInUser,
                files,
                isBurgerMenuOpened,
                isEditing,
                isLoggedIn: authStatus === 'authenticated',
                emailParam,
                setIsEditing,
                setIsBurgerMenuOpened,
                onTryToLikeFile: toggleLike,
                onOpenEditionMode: handleOpenEditionMode,
                onDeleteFile: handleDeleteFile,
                onOpenDeleteModal: handleOpenDeleteModal
            }}/>
            {openedImage && (
                <div className={styles['opened-image__background']} onClick={() => setOpenedImage(null)}>
                    <img
                        src={openedImage}
                        alt="Opened"
                        className={styles['opened-image__image']}
                        onClick={e => e.stopPropagation()}
                    />
                </div>
            )}
            {isEditing ? (
                <EditMode
                    file={file}
                    parseFileTextToHTML={parseFileTextToHTMLMemo}
                    onImageClick={handleOpenImage}
                    isFileTreeOpened={isFileTreeOpened}
                />
            ) : (
                <div className={styles['opened-file__content']}>{contentElements}</div>
            )}
            <div className={styles['opened-file__footer']}>
                Last edited by:
                <span
                    onClick={() => handleGoToUsersPage(file.lastEditor as string)}
                    className={styles['footer__editor']}>
                            {file.lastEditor}
                        </span>
            </div>
            <div
                style={{display: isFileTreeOpened ? 'none' : 'flex'}}
                className={emptyStyles['file-tree']}
                onClick={(event) => {
                    event.stopPropagation()
                    setIsFileTreeOpened(!isFileTreeOpened)
                }}>
                <BurgerSvg className={emptyStyles['file-tree-image']}/>
            </div>
        </div>
    )
}

export default OpenedFile