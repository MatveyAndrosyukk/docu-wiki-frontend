import React, {useCallback, useMemo} from 'react';
import styles from './EditMode.module.scss';
import SwitchWhileEditModal
    from "../../../../../../shared/ui/modal-windows/switch-while-edit-modal/SwitchWhileEditModal";
import extractImagesName from "../../../../../../shared/lib/utils/extractImageNames";
import {useDebouncedValue} from "../../../../../../shared/lib/hooks/useDebouncedValue";
import {UiFile} from "../../../../../../store/types/UiFile";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store";
import {useAppContext} from "../../../../../../context/app-context/hooks/useAppContext";
import {useEditorTextarea} from "../../../../../../shared/lib/hooks/useEditorTextarea";
import {useEditorValidation} from "../../../../../../shared/lib/hooks/useEditorValidation";
import {createEditorToolbar} from "../../../../../../shared/lib/utils/createEditorToolbar";
import EditorToolbar from "../../../../../../shared/ui/editor-toolbar/EditorToolbar";
import useFileImagesHandler from "../../../../../../shared/lib/hooks/use-file-images-handler/useFileImagesHandler";

interface Params {
    file: UiFile;
    parseFileTextToHTML: (
        content: string,
        onImageClick: (
            imageUrl: string
        ) => void | null,
        isFileTreeOpened: boolean
    ) => React.ReactNode[],
    isFileTreeOpened: boolean,
    onImageClick: (
        imageUrl: string
    ) => void | null;
}

const EditMode: React.FC<Params> = (
    {
        file,
        parseFileTextToHTML,
        onImageClick,
        isFileTreeOpened,
    }
) => {
    const {fileState} = useAppContext();

    const loggedInUser = useSelector(
        (state: RootState) => state.user.loggedInUser
    );

    const isSaving = useSelector(
        (state: RootState) => state.fileUi.isSaving
    );

    const {
        fileEditor
    } = fileState


    const {
        textareaRef,
        textareaContent,
        setTextareaContent,
        pasteTag,
        wrapSelection,
        handleChangeTextareaContent
    } = useEditorTextarea(
        file.content ?? '',
        fileEditor.actions.setIsFileContentChanged
    );

    const debouncedTextareaContent = useDebouncedValue(textareaContent, 300);

    const amountOfImagesInTextArea = useMemo(
        () => extractImagesName(debouncedTextareaContent),
        [debouncedTextareaContent]
    );

    const previewContent = useMemo(
        () =>
            parseFileTextToHTML(
                debouncedTextareaContent,
                onImageClick,
                isFileTreeOpened
            ),
        [
            debouncedTextareaContent,
            parseFileTextToHTML,
            onImageClick,
            isFileTreeOpened,
        ]
    );

    useEditorValidation(
        textareaContent,
        amountOfImagesInTextArea,
        loggedInUser,
        fileEditor.actions.setContentError,
    );

    const replaceImageTag = useCallback(
        (
            tempName: string,
            realName: string
        ) => {
            setTextareaContent(
                prev =>
                    prev.replace(
                        `[image/${tempName}]`,
                        `[image/${realName}]`
                    )
            );
        },
        [setTextareaContent]
    );

    const fileImagesHandler = useFileImagesHandler(
        {
            fileId: file.id,
            pasteTag,
            replaceImageTag,
            contentError: fileEditor.state.contentError,
            initialContent: file.content ?? '',
        }
    );

    const toolbar = createEditorToolbar(
        wrapSelection,
        pasteTag,
        fileImagesHandler.actions.openDialog
    );

    const handleSaveEdition = useCallback(
        (
            newContent: string,
            addedImages: string[],
        ) => {
            if (!file) return;

            try {
                fileEditor.actions.saveChanges(
                    file.id as number,
                    newContent,
                    addedImages,
                    loggedInUser?.name
                );


                fileImagesHandler.actions.reset([]);
            } catch (error) {
                console.error('Save failed:', error);
            }
        }
        ,
        [file, fileEditor.actions, fileImagesHandler.actions, loggedInUser?.name]
    );

    const handleCancelEdition = useCallback(
        async (
            addedImages: string[],
            contentBeforeEdition: string,
        ) => {
            try {
                await fileEditor.actions.cancelChanges(
                    contentBeforeEdition,
                    addedImages
                );

                fileImagesHandler.actions.reset([]);
            } catch (error) {
                console.error('Cancel failed:', error);
            }
        },
        [fileEditor.actions, fileImagesHandler.actions]
    );

    return (
        <div className={styles['edit-mode']}>
            <div className={styles['edit-mode__header']}>
                <div className={styles['header__edit-buttons']}>

                    <EditorToolbar toolbar={toolbar}/>

                    <input
                        type="file"
                        accept="image/*"
                        style={{display: 'none'}}
                        ref={fileImagesHandler.state.inputRef}
                        onChange={fileImagesHandler.actions.changeFile}
                    />

                </div>

                <div className={styles['header__action-buttons']}>

                    <button
                        className={styles['header__action-buttons-save']}
                        onClick={
                            () => handleSaveEdition(
                                textareaContent,
                                fileImagesHandler.state.addedImages)}
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving…' : 'Save'}
                    </button>

                    <button
                        className={styles['header__action-buttons-cancel']}
                        onClick={
                            () => handleCancelEdition(
                                fileImagesHandler.state.addedImages,
                                file.content ?? '')}
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <div className={styles['edit-mode__body']}>
                    <textarea
                        ref={textareaRef}
                        className={styles['body__textarea']}
                        value={textareaContent}
                        onChange={handleChangeTextareaContent}
                    />

                <div className={styles['edit-mode__error']}>
                    {fileEditor.state.contentError}
                </div>

                <div className={styles['body__preview']}>
                    <div className={styles['body__preview-title']}>
                        Preview
                    </div>

                    <div className={styles['body__preview-content']}>
                        {previewContent}
                    </div>
                </div>
            </div>

            <SwitchWhileEditModal
                contentBeforeEdition={file.content ?? ''}
                onCancelEditedFileChange={handleCancelEdition}
                addedImagesWhileEditing={fileImagesHandler.state.addedImages}
            />
        </div>
    );
};

export default EditMode;