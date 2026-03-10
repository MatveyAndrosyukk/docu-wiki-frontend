import React, {Dispatch, SetStateAction, useCallback, useContext, useMemo} from 'react'
import styles from './OpenedFile.module.scss'
import emptyStyles from './components/empty-file/EmplyFile.module.scss'
import {ReactComponent as BurgerSvg} from './images/empty-file-burger.svg'
import {parseFileTextToHTML} from '../../../../utils/functions/parseFile'
import EditMode from './components/edit-file-view/EditMode'
import {AppContext} from '../../../../context/AppContext'
import {useNavigate} from "react-router-dom";
import EmptyFile from "./components/empty-file/EmptyFile";
import OpenedFileHeader from "./opened-file-header/OpenedFileHeader";
import {useSelector} from "react-redux";
import {UiFile} from "../../../../store/types/UiFile";
import {selectFileTree} from "../../../../store/selectors/selectFileTree";
import {useFileLikes} from "../../../../utils/hooks/useFileLikes";
import {RootState} from "../../../../store";
import {useAuth} from "../../../../utils/hooks/useAuth";

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
    const context = useContext(AppContext)
    if (!context) throw new Error("Component can't be used without context")
    const {viewedUser, fileState, authState, loggedInUser} = context
    const [openedImage, setOpenedImage] = React.useState<string | null>(null)
    const [isBurgerMenuOpened, setIsBurgerMenuOpened] = React.useState(false)
    const files = useSelector(selectFileTree)
    const {isLiked, likes, toggleLike} = useFileLikes({fileId: file?.id as number});
    const pendingImages = useSelector(
        (state: RootState) => state.fileUi.pendingImages
    );
    const {authStatus} = useAuth();

    const {
        isEditing,
        setIsEditing,
        handleOpenDeleteModal
    } = fileState

    const handleImageClick = useCallback((imageUrl: string) => {
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
        return parseFileTextToHTML(file.content, handleImageClick, isFileTreeOpened, pendingImages);
    }, [file?.content, handleImageClick, isFileTreeOpened, pendingImages]);

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
                    onImageClick={handleImageClick}
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