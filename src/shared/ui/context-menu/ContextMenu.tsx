import React, {FC} from 'react';
import styles from './ContextMenu.module.scss'
import {FileType} from "../../../types/file";
import {UiFile} from "../../../store/types/UiFile";
import {useAppContext} from "../../../context/app-context/hooks/useAppContext";
import {useElementOutsideEvent} from "../../lib/hooks/useElementOutsideEvent";

interface ContextMenuProps {
    clickX: number;
    clickY: number;
    file: UiFile;
    onCloseContextMenu: () => void;
    menuRef: React.RefObject<HTMLUListElement | null>;
}

const ContextMenu: FC<ContextMenuProps> = (
    {
        clickX,
        clickY,
        file,
        onCloseContextMenu,
        menuRef,
    }) => {

    const {fileState} = useAppContext();

    const contextMenu = fileState.contextMenu;

    useElementOutsideEvent(
        menuRef,
        "click",
        onCloseContextMenu
    );

    return (
        <div>
            <ul className={styles['context-menu']}
                style={{top: clickY, left: clickX}}
                ref={menuRef}
                onClick={onCloseContextMenu}>
                {file.type === FileType.Folder && (
                    <>
                        {contextMenu.copiedFile && (
                            <li className={styles['context-menu__item']}
                                onClick={() => contextMenu.paste(file.id)}>
                                Paste
                            </li>
                        )}
                        <li className={styles['context-menu__item']}
                            onClick={() => contextMenu.addFile(file.id)}>
                            Add File
                        </li>
                        <li className={styles['context-menu__item']}
                            onClick={() => contextMenu.addFolder(file.id)}>
                            Add Folder
                        </li>
                    </>
                )}
                <li className={styles['context-menu__item']}
                    onClick={() => contextMenu.rename(file)}>
                    Rename
                </li>
                <li className={styles['context-menu__item']}
                    onClick={() => contextMenu.copy(file)}>
                    Copy
                </li>
                <li className={`${styles['context-menu__item']} ${styles['context-menu__item-delete']}`}
                    onClick={() => contextMenu.remove(file)}
                >
                    Delete
                </li>
            </ul>
        </div>
    );
};

export default ContextMenu;