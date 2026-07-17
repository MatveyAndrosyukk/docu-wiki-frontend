import React, {FC} from 'react';
import styles from './ContextMenu.module.scss'
import {FileType} from "../../../types/file";
import {useAppContext} from "../../../context/app-context/hooks/useAppContext";
import {useElementOutsideEvent} from "../../lib/hooks/useElementOutsideEvent";

const ContextMenu: FC = () => {

    const {
        filesHandler
    } = useAppContext();

    const {
        contextMenuHandler
    } = filesHandler;

    const contextMenuFile = contextMenuHandler.state.file;

    useElementOutsideEvent(
        {
            ref: contextMenuHandler.state.menuRef,
            eventType: "click",
            handler: contextMenuHandler.actions.close
        }
    );

    if (!contextMenuFile) {

        return null;
    }

    return (
        <div>
            <ul
                className={
                    styles['context-menu']
                }

                style={
                    {
                        top: contextMenuHandler.state.clickY,
                        left: contextMenuHandler.state.clickX
                    }
                }

                ref={
                    contextMenuHandler.state.menuRef
                }

                onClick={
                    contextMenuHandler.actions.close
                }
            >
                {
                    contextMenuFile.type ===
                    FileType.Folder && (

                        <>
                            {
                                contextMenuHandler.state.copiedFile && (

                                    <li
                                        className={
                                            styles['context-menu__item']
                                        }

                                        onClick={
                                            () => contextMenuHandler.actions.paste(
                                                contextMenuFile.id
                                            )
                                        }
                                    >
                                        Paste
                                    </li>
                                )
                            }

                            <li
                                className={
                                    styles['context-menu__item']
                                }

                                onClick={
                                    () => contextMenuHandler.actions.addFile(
                                        contextMenuFile.id
                                    )
                                }
                            >
                                Add File
                            </li>

                            <li
                                className={
                                    styles['context-menu__item']
                                }

                                onClick={
                                    () => contextMenuHandler.actions.addFolder(
                                        contextMenuFile.id
                                    )
                                }
                            >
                                Add Folder
                            </li>
                        </>
                    )
                }

                <li
                    className={
                        styles['context-menu__item']
                    }

                    onClick={
                        () => contextMenuHandler.actions.rename(
                            contextMenuFile
                        )
                    }
                >
                    Rename
                </li>

                <li
                    className={
                        styles['context-menu__item']
                    }

                    onClick={
                        () => contextMenuHandler.actions.copy(
                            contextMenuFile
                        )
                    }
                >
                    Copy
                </li>

                <li
                    className={`
                    ${styles['context-menu__item']} 
                    ${styles['context-menu__item-delete']}
                    `}

                    onClick={
                        () => contextMenuHandler.actions.remove(
                            contextMenuFile
                        )
                    }
                >
                    Delete
                </li>
            </ul>
        </div>
    );
};

export default ContextMenu;