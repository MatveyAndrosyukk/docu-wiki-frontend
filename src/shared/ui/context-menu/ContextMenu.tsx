import React, {FC, useEffect} from 'react';
import styles from './ContextMenu.module.scss'
import {FileType} from "../../../types/file";
import {ActionType} from "../../lib/hooks/useModalActions";
import {UiFile} from "../../../store/types/UiFile";
import {useAppContext} from "../../lib/hooks/useAppContext";
import {useSelector} from "react-redux";
import {RootState} from "../../../store";

interface ContextMenuProps {
    clickX: number;
    clickY: number;
    file: UiFile;
    onCloseContextMenu: () => void;
}

const ContextMenu: FC<ContextMenuProps> = (
    {
        clickX,
        clickY,
        file,
        onCloseContextMenu,
    }) => {

    const {fileState} = useAppContext();

    const viewedUser = useSelector((state: RootState) => state.user.viewedUser);

    const {
        copiedFile,
        handlePasteFile,
        handleOpenModalByReason,
        handleCopyFile,
        handleOpenDeleteModal,
    } = fileState;

    useEffect(() => {
        const handleClickOutside = () => onCloseContextMenu();
        window.addEventListener('click', handleClickOutside);
        return () => window.removeEventListener('click', handleClickOutside);
    }, [onCloseContextMenu]);

    return (
        <div>
            <ul className={styles['context-menu']}
                style={{top: clickY, left: clickX}}>
                {file.type === FileType.Folder && (
                    <>
                        {copiedFile && (
                            <li className={styles['context-menu__item']}
                                onClick={() => handlePasteFile(file.id)}>
                                Paste
                            </li>
                        )}
                        <li className={styles['context-menu__item']}
                            onClick={() => handleOpenModalByReason({
                                reason: ActionType.AddFile,
                                id: file.id,
                                title: "Add File"
                            })}>
                            Add File
                        </li>
                        <li className={styles['context-menu__item']}
                            onClick={() => handleOpenModalByReason({
                                reason: ActionType.AddFolder,
                                id: file.id,
                                title: 'Add Folder'
                            })}>
                            Add Folder
                        </li>
                    </>
                )}
                <li className={styles['context-menu__item']}
                    onClick={() => handleOpenModalByReason({
                        reason: ActionType.RenameFile,
                        id: file.id,
                        title: "Rename file"
                    })}>
                    Rename
                </li>
                <li className={styles['context-menu__item']}
                    onClick={() => handleCopyFile(file)}>
                    Copy
                </li>
                <li className={`${styles['context-menu__item']} ${styles['context-menu__item-delete']}`}
                    onClick={() => handleOpenDeleteModal(file, viewedUser)}>
                    Delete
                </li>
            </ul>
        </div>
    );
};

export default ContextMenu;