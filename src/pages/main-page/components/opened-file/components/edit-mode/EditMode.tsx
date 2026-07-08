import React, {FC, useCallback, useMemo,} from "react";

import styles from "./EditMode.module.scss";

import SwitchWhileEditModal
    from "../../../../../../shared/ui/modal-windows/switch-while-edit-modal/SwitchWhileEditModal";

import {UiFile} from "../../../../../../store/types/UiFile";

import {useSelector} from "react-redux";

import {RootState} from "../../../../../../store";

import {useAppContext} from "../../../../../../context/app-context/hooks/useAppContext";

import {useDebouncedValue} from "../../../../../../shared/lib/hooks/useDebouncedValue";
import EditorToolbar from "../../../../../../shared/ui/editor-toolbar/EditorToolbar";
import useEditorHandler from "../../../../../../shared/lib/hooks/use-editor-handler/useEditorHandler";


interface Params {

    file: UiFile;

    parseFileTextToHTML: (
        content: string,
        onImageClick: (
            imageUrl: string
        ) => void,
        isFileTreeOpened: boolean
    ) => React.ReactNode[];

    isFileTreeOpened: boolean;

    onImageClick: (
        imageUrl: string
    ) => void;

}


const EditMode: FC<Params> = (
    {
        file,
        parseFileTextToHTML,
        onImageClick,
        isFileTreeOpened,
    }
) => {

    const {
        fileState,
    } = useAppContext();


    const loggedInUser =
        useSelector(
            (state: RootState) =>
                state.user.loggedInUser
        );


    const isSaving =
        useSelector(
            (state: RootState) =>
                state.fileUi.isSaving
        );


    const editorHandler =
        useEditorHandler({

            editHandler:
            fileState.fileEditor,

            fileId:
            file.id,

            initialContent:
                file.content ?? "",

            contentError:
            fileState.fileEditor.state.contentError,

            loggedInUser,

        });


    const debouncedContent =
        useDebouncedValue(
            editorHandler.textareaHandler.state.content,
            300
        );


    const previewContent =
        useMemo(
            () =>
                parseFileTextToHTML(
                    debouncedContent,
                    onImageClick,
                    isFileTreeOpened
                ),
            [
                debouncedContent,
                parseFileTextToHTML,
                onImageClick,
                isFileTreeOpened,
            ]
        );


    const handleSaveEdition =
        useCallback(
            () => {

                editorHandler.editHandler.actions.saveChanges(
                    file.id,
                    editorHandler.textareaHandler.state.content,
                    editorHandler.imagesHandler.state.addedImages,
                    loggedInUser?.name
                );

                editorHandler.imagesHandler.actions.reset([]);

            },
            [
                editorHandler,
                file.id,
                loggedInUser?.name,
            ]
        );


    const handleCancelEdition =
        useCallback(
            async () => {

                await editorHandler.editHandler.actions.cancelChanges(
                    file.content ?? "",
                    editorHandler.imagesHandler.state.addedImages
                );


                editorHandler.imagesHandler.actions.reset([]);

            },
            [
                editorHandler,
                file.content,
            ]
        );


    return (

        <div className={styles["edit-mode"]}>


            <div className={styles["edit-mode__header"]}>


                <div className={styles["header__edit-buttons"]}>


                    <EditorToolbar
                        toolbar={
                            editorHandler.toolbar
                        }
                    />


                    <input

                        type="file"

                        accept="image/*"

                        style={{
                            display: "none"
                        }}

                        ref={
                            editorHandler.imagesHandler.state.inputRef
                        }

                        onChange={
                            editorHandler.imagesHandler.actions.changeFile
                        }

                    />


                </div>


                <div className={styles["header__action-buttons"]}>


                    <button

                        className={
                            styles["header__action-buttons-save"]
                        }

                        onClick={
                            handleSaveEdition
                        }

                        disabled={
                            isSaving
                        }

                    >

                        {
                            isSaving
                                ? "Saving…"
                                : "Save"
                        }

                    </button>


                    <button

                        className={
                            styles["header__action-buttons-cancel"]
                        }

                        onClick={
                            handleCancelEdition
                        }

                    >

                        Cancel

                    </button>


                </div>


            </div>


            <div className={styles["edit-mode__body"]}>


                <textarea

                    ref={
                        editorHandler.textareaHandler.state.textareaRef
                    }

                    className={
                        styles["body__textarea"]
                    }

                    value={
                        editorHandler.textareaHandler.state.content
                    }

                    onChange={
                        editorHandler.textareaHandler.actions.handleChangeTextarea
                    }

                />


                <div className={styles["edit-mode__error"]}>

                    {
                        editorHandler.editHandler.state.contentError
                    }

                </div>


                <div className={styles["body__preview"]}>


                    <div className={styles["body__preview-title"]}>

                        Preview

                    </div>


                    <div className={styles["body__preview-content"]}>

                        {
                            previewContent
                        }

                    </div>


                </div>


            </div>


            <SwitchWhileEditModal

                contentBeforeEdition={
                    file.content ?? ""
                }

                onCancelEditedFileChange={
                    handleCancelEdition
                }

                addedImagesWhileEditing={
                    editorHandler.imagesHandler.state.addedImages
                }

            />


        </div>

    );

};


export default EditMode;