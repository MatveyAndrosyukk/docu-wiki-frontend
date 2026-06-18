import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import styles from "../../OpenedFile.module.scss";
import headerStyles from "./OpenedFileHeader.module.scss"
import {isUserCanEdit} from "../../../../../../shared/lib/utils/permissions-utils/isUserCanEdit";
import {ReactComponent as HeartBtn} from '../../images/opened-file-heart.svg'
import {ReactComponent as LikedHeartBtn} from '../../images/opened-file-red-heart.svg'
import {ReactComponent as EditFileSvg} from '../../images/opened-file-edit.svg'
import {ReactComponent as DeleteFileSvg} from '../../images/opened-file-delete.svg'
import {ReactComponent as OpenButtonsSvg} from '../../images/opened-file-open.svg'
import {ReactComponent as ShareIcon} from './images/share.svg';
import {ReactComponent as EditIcon} from './images/edit.svg';
import {ReactComponent as DeleteIcon} from './images/delete.svg';
import {User} from "../../../../../../store/slices/userSlice";
import findPathToFile from "../../../../../../shared/lib/utils/findFilePath";
import {UiFile} from "../../../../../../store/types/UiFile";
import {useWindowWidth} from "../../../../../../shared/lib/hooks/useWindowWidth";

interface OpenedFileHeaderProps {
    file: UiFile;
    isLiked: boolean | null | undefined;
    onTryToLikeFile: () => void;
    viewedUser: User | null;
    files: UiFile[];
    likes: number;
    isBurgerMenuOpened: boolean;
    setIsBurgerMenuOpened: Dispatch<SetStateAction<boolean>>;
    isEditing: boolean;
    onOpenEditionMode: () => void;
    onDeleteFile: (file: UiFile) => void;
    isLoggedIn: boolean;
    emailParam: string | undefined;
    loggedInUser: User | null;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    onOpenDeleteModal: (file: UiFile, user: User | null) => void;
}

const OpenedFileHeader: React.FC<OpenedFileHeaderProps> = (
    {
        file,
        isLiked,
        onTryToLikeFile,
        viewedUser,
        files,
        likes,
        isBurgerMenuOpened,
        setIsBurgerMenuOpened,
        isEditing,
        onOpenEditionMode,
        onDeleteFile,
        isLoggedIn,
        emailParam,
        loggedInUser,
        setIsEditing,
        onOpenDeleteModal,
    }
) => {
    const width = useWindowWidth();
    const [copied, setCopied] = useState(false);

    const isMobile = width < 435;

    const likesStyle = useMemo(() => {
        const likesCount = file?.likes?.toString().length || 1;
        return likesCount === 1 ? 'one-digit' :
            likesCount === 2 ? 'two-digit' :
                likesCount === 3 ? 'three-digit' : 'four-digit';
    }, [file?.likes]);

    const pathToFile = findPathToFile(files, file?.id as number)?.join('/')

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.href).then();
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
    };

    return (
        <div className={styles['opened-file__header']}>
            <div className={styles['header__left-side']}>
                <div className={styles['header__likes']}>
                    <div
                        className={`${styles['header__likes-amount']} ${styles[likesStyle]}`}>{likes}</div>
                    {
                        isLiked ?
                            <LikedHeartBtn onClick={() => onTryToLikeFile()}/> :
                            <HeartBtn onClick={() => onTryToLikeFile()}/>
                    }
                </div>
                <div className={styles['header__title']}>
                    <div className={styles['header__title-email']}>{viewedUser?.name}</div>
                    <span className={styles['header__title-dash']}>|</span>
                    <div className={styles['header__title-path']} title={pathToFile}>{pathToFile}</div>
                </div>
            </div>
            <div className={styles['header__right-side']}>
                {isUserCanEdit(isLoggedIn, emailParam, viewedUser, loggedInUser) && (
                    <>
                        {isMobile ? (
                            <div className={styles['header__buttons']}>
                                <OpenButtonsSvg
                                    className={`${styles['buttons-menu-open']}`}
                                    onClick={() => setIsBurgerMenuOpened(!isBurgerMenuOpened)}/>
                                {isBurgerMenuOpened && !isEditing && (
                                    <div className={styles['buttons-menu']}>
                                        <EditFileSvg
                                            className={`${styles['buttons-menu-item']}`}
                                            onClick={() => onOpenEditionMode()}/>
                                        <DeleteFileSvg
                                            className={`${styles['buttons-menu-item']}`}
                                            onClick={() => onDeleteFile(file)}/>
                                    </div>
                                )}
                                {isBurgerMenuOpened && isEditing && (
                                    <div className={styles['buttons-menu']}>
                                        <DeleteFileSvg
                                            className={`${styles['buttons-menu-item']}`}
                                            onClick={() => onDeleteFile(file)}/>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={styles['header__links']}>
                                <div className={styles['links__container']}>
                                    {!isEditing && (
                                        <>
                                            <div
                                                className={headerStyles.button}
                                                onClick={handleCopyLink}
                                                title={'Copy link'}
                                            >
                                                {copied ?
                                                    '✓'
                                                    :
                                                    <ShareIcon className={headerStyles.icon}/>}
                                            </div>
                                            <div
                                                className={headerStyles.button}
                                                onClick={() => setIsEditing(true)}
                                                title={'Edit file'}
                                            >
                                                <EditIcon className={headerStyles.icon}/>
                                            </div>
                                            <div
                                                className={`${headerStyles.button} ${headerStyles.delete}`}
                                                onClick={() => onOpenDeleteModal(file, viewedUser)}
                                                title={'Remove file'}
                                            >
                                                <DeleteIcon className={`${headerStyles.icon} ${headerStyles.deleteIcon}`}/>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default OpenedFileHeader;