import React, {Dispatch, SetStateAction, useMemo, useState} from 'react';
import styles from "../../OpenedFile.module.scss";
import {isUserCanEdit} from "../../../../../../shared/lib/utils/permissions-utils/isUserCanEdit";
import {ReactComponent as HeartBtn} from '../../images/heart.svg'
import {ReactComponent as LikedHeartBtn} from '../../images/red-heart.svg'
import {ReactComponent as EditFileSvg} from '../../images/edit.svg'
import {ReactComponent as DeleteFileSvg} from '../../images/delete.svg'
import {ReactComponent as OpenButtonsSvg} from '../../images/open.svg'
import findPathToFile from "../../../../../../shared/lib/utils/findFilePath";
import {UiFile} from "../../../../../../store/types/UiFile";
import {useWindowWidth} from "../../../../../../shared/lib/hooks/useWindowWidth";
import {useSelector} from "react-redux";
import {selectOpenedFile} from "../../../../../../store/selectors/selectOpenedFile";
import {selectFileTree} from "../../../../../../store/selectors/selectFileTree";
import {RootState} from "../../../../../../store";
import {useAuthContext} from "../../../../../../context/auth-context/hooks/useAuthContext";
import {useAppContext} from "../../../../../../context/app-context/hooks/useAppContext";

interface Params {
    isBurgerMenuOpened: boolean;

    setIsBurgerMenuOpened: Dispatch<
        SetStateAction<boolean>
    >;

    onOpenEditionMode: () => void;

    onDeleteFile: (
        file: UiFile
    ) => void;

    emailParam: string | undefined;
}

const OpenedFileHeader: React.FC<Params> = (
    {
        isBurgerMenuOpened,
        setIsBurgerMenuOpened,
        onOpenEditionMode,
        onDeleteFile,
        emailParam,
    }
) => {

    const {
        authStatus
    } = useAuthContext();

    const {
        editorHandler,
        filesHandler,
    } = useAppContext();

    const {
        editModeHandler
    } = editorHandler;

    const {
        fileRemoveHandler,
        fileLikesHandler
    } = filesHandler;

    const [copied, setCopied] = useState(
        false
    );

    const file = useSelector(
        selectOpenedFile
    );

    const files = useSelector(
        selectFileTree
    )

    const viewedUser = useSelector(
        (state: RootState) => state.user.viewedUser
    );

    const loggedInUser = useSelector(
        (state: RootState) => state.user.loggedInUser
    );

    const width = useWindowWidth();

    const isLoggedIn = authStatus === "authenticated";

    const isMobile = width < 435;

    const isLiked = Boolean(
        file?.isLiked
    );

    const likesStyle = useMemo(
        () => {

            const likesCount = file?.likes?.toString().length
                || 1;

            return likesCount === 1 ? 'one-digit' :
                likesCount === 2 ? 'two-digit' :
                    likesCount === 3 ? 'three-digit' : 'four-digit';
        },
        [
            file?.likes
        ]
    );

    const pathToFile = findPathToFile(
        files,
        file?.id as number
    )?.join('/');

    const handleCopyLink = () => {

        navigator.clipboard.writeText(
            window.location.href
        ).then();

        setCopied(true);

        setTimeout(
            () => setCopied(false),
            1500
        );
    };

    if (!file) {
        return null;
    }

    return (
        <div
            className={
                styles['opened-file__header']
            }
        >
            <div
                className={
                    styles['header__left-side']
                }
            >
                <div
                    className={
                        styles['header__likes']
                    }
                >
                    <div
                        className={
                            `${styles['header__likes-amount']} ${styles[likesStyle]}`
                        }
                    >
                        {
                            file.likes
                        }
                    </div>
                    {

                        isLiked ?
                            <LikedHeartBtn
                                onClick={
                                    () => fileLikesHandler.actions.toggleLike()
                                }
                            /> :
                            <HeartBtn
                                onClick={
                                    () => fileLikesHandler.actions.toggleLike()
                                }
                            />
                    }
                </div>

                <div
                    className={
                        styles['header__title']
                    }
                >
                    <div
                        className={
                            styles['header__title-email']
                        }
                    >
                        {
                            viewedUser?.name
                        }
                    </div>
                    <span
                        className={
                            styles['header__title-dash']
                        }
                    >
                        |
                    </span>
                    <div
                        className={
                            styles['header__title-path']
                        }

                        title={
                            pathToFile
                        }

                    >
                        {
                            pathToFile
                        }
                    </div>
                </div>
            </div>
            <div
                className={
                    styles['header__right-side']
                }
            >
                {

                    isUserCanEdit(
                        isLoggedIn,
                        emailParam,
                        viewedUser,
                        loggedInUser
                    ) && (

                        <>
                            {

                                isMobile ? (

                                    <div
                                        className={
                                            styles['header__buttons']
                                        }
                                    >
                                        <OpenButtonsSvg
                                            className={
                                                `${styles['buttons-menu-open']}`
                                            }

                                            onClick={
                                                () => setIsBurgerMenuOpened(
                                                    !isBurgerMenuOpened
                                                )
                                            }
                                        />
                                        {

                                            (isBurgerMenuOpened
                                                && !editModeHandler.state.isEditing) && (

                                                <div
                                                    className={
                                                        styles['buttons-menu']
                                                    }
                                                >
                                                    <EditFileSvg
                                                        className={
                                                            `${styles['buttons-menu-item']}`
                                                        }

                                                        onClick={
                                                            () => onOpenEditionMode()
                                                        }
                                                    />
                                                    <DeleteFileSvg
                                                        className={
                                                            `${styles['buttons-menu-item']}`
                                                        }

                                                        onClick={
                                                            () => onDeleteFile(
                                                                file
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )
                                        }
                                        {

                                            (isBurgerMenuOpened
                                                && editModeHandler.state.isEditing) && (

                                                <div
                                                    className={
                                                        styles['buttons-menu']
                                                    }
                                                >
                                                    <DeleteFileSvg
                                                        className={
                                                            `${styles['buttons-menu-item']}`
                                                        }

                                                        onClick={
                                                            () => onDeleteFile(
                                                                file
                                                            )
                                                        }
                                                    />
                                                </div>
                                            )
                                        }
                                    </div>
                                ) : (

                                    <div
                                        className={
                                            styles['header__links']
                                        }
                                    >
                                        <div
                                            className={
                                                styles['links__container']
                                            }
                                        >
                                            {
                                                !editModeHandler.state.isEditing && (
                                                    <>
                                                        <div
                                                            className={
                                                                styles['links__copy']
                                                            }

                                                            onClick={
                                                                handleCopyLink
                                                            }
                                                        >
                                                            {copied ? 'Copied!' : 'Share'}
                                                        </div>
                                                        <div
                                                            className={
                                                                styles['links__edit']
                                                            }

                                                            onClick={
                                                                () => editModeHandler.actions.setIsEditing(
                                                                    true
                                                                )
                                                            }
                                                        >
                                                            Edit
                                                        </div>
                                                        <div
                                                            className={
                                                                styles['links__delete']
                                                            }

                                                            onClick={
                                                                () => fileRemoveHandler.actions.open(
                                                                    file,
                                                                    viewedUser
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </div>
                                                    </>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </>
                    )
                }
            </div>
        </div>
    );
};

export default OpenedFileHeader;