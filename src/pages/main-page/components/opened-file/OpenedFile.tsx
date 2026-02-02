import React, {Dispatch, SetStateAction, useCallback, useContext, useEffect, useMemo} from 'react'
import styles from './OpenedFile.module.scss'
import emptyStyles from './components/empty-file/EmplyFile.module.scss'
import {ReactComponent as BurgerSvg} from './images/empty-file-burger.svg'
import {parseFileTextToHTML} from '../../../../utils/functions/parseFile'
import EditMode from './components/edit-file-view/EditMode'
import {AppContext} from '../../../../context/AppContext'
import {useNavigate} from "react-router-dom";
import {File} from "../../../../types/file";
import EmptyFile from "./components/empty-file/EmptyFile";
import OpenedFileHeader from "./opened-file-header/OpenedFileHeader";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../store";
import {revertFileLike, toggleFileLikeOptimistic} from "../../../../store/slices/fileTreeSlice";

interface OpenedFileProps {
    file?: File | null
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
    const dispatch = useDispatch<AppDispatch>();
    if (!context) throw new Error("Component can't be used without context")
    const {viewedUser, files, fileState, authState, loggedInUser} = context
    const [isLiked, setIsLiked] = React.useState(file?.isLiked)
    const [isLiking, setIsLiking] = React.useState(false);
    const [openedImage, setOpenedImage] = React.useState<string | null>(null)
    const [isBurgerMenuOpened, setIsBurgerMenuOpened] = React.useState(false)

    const {
        isEditing,
        setIsEditing,
        handleLikeFile,
        handleOpenDeleteModal,
    } = fileState

    const {
        isLoggedIn,
        handleOpenLoginModal
    } = authState

    useEffect(() => {
        if (!file || isLiking) return;

        setIsLiked(file?.isLiked)
    }, [file, isLiking])

    const handleImageClick = useCallback((imageUrl: string) => {
        setOpenedImage(imageUrl)
    }, []);

    const parseFileTextToHTMLMemo = useCallback(
        (content: string,
         onImageClick: (url: string) => void,
         isFileTreeOpened: boolean) =>
            parseFileTextToHTML(content, onImageClick, isFileTreeOpened),
        []
    );

    const contentElements = useMemo(() => {
        if (!file?.content) return [];
        return parseFileTextToHTML(file.content, handleImageClick, isFileTreeOpened);
    }, [file?.content, handleImageClick, isFileTreeOpened]);



    const handleTryToLikeFile = useCallback(async () => {
        if (!file || isLiking) return;
        setIsLiking(true);

        const email = localStorage.getItem("email");
        if (!email) return handleOpenLoginModal();

        const fileId = file.id as number;
        const prevLiked = isLiked;
        setIsLiked(prev => !prev);

        dispatch(toggleFileLikeOptimistic({
            fileId,
            isLiked: prevLiked
        }));

        try {
            const dto = {id: fileId, email};
            await handleLikeFile(dto)
                .then(() => setIsLiking(false))
        } catch (error) {
            setIsLiked(prevLiked);
            dispatch(revertFileLike({fileId, isLiked}));
            setIsLiking(false);
        }
    }, [dispatch, file, handleLikeFile, handleOpenLoginModal, isLiked, isLiking]);

    const handleGoToUsersPage = useCallback((user: string | null) => {
        return navigate(`/${encodeURIComponent(user as string)}`)
    }, [navigate])

    const handleOpenEditionMode = useCallback(() => {
        setIsEditing(true);
        setIsBurgerMenuOpened(false);
    }, [setIsEditing])

    const handleDeleteFile = useCallback((file: File) => {
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
            <button onClick={() => console.log(file.isLiked)}>df</button>
            <OpenedFileHeader {...{
                file,
                isLiked,
                viewedUser,
                loggedInUser,
                files,
                isBurgerMenuOpened,
                isEditing,
                isLoggedIn,
                emailParam,
                setIsEditing,
                setIsBurgerMenuOpened,
                onTryToLikeFile: handleTryToLikeFile,
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
                    onClick={() => handleGoToUsersPage(file.lastEditor)}
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