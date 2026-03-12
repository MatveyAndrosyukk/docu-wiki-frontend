import React, {useCallback, useMemo} from 'react';
import styles from './EditMode.module.scss';
import SwitchWhileEditModal from "../../../../../../shared/ui/modal-windows/switch-while-edit-modal/SwitchWhileEditModal";
import extractImagesName from "../../../../../../shared/lib/utils/extractImageNames";
import {useDebouncedValue} from "../../../../../../shared/lib/hooks/useDebouncedValue";
import {UiFile} from "../../../../../../store/types/UiFile";
import {useSelector} from "react-redux";
import {RootState} from "../../../../../../store";
import {useAppContext} from "../../../../../../shared/lib/hooks/useAppContext";
import {useEditorTextarea} from "../../../../../../shared/lib/hooks/useEditorTextarea";
import {useEditorPreview} from "../../../../../../shared/lib/hooks/useEditorPreview";
import {useEditorValidation} from "../../../../../../shared/lib/hooks/useEditorValidation";
import {useEditorImages} from "../../../../../../shared/lib/hooks/useEditorImages";
import {createEditorToolbar} from "./utils/editorToolbarConfig";
import EditorToolbar from "../../../../../../shared/ui/editor-toolbar/EditorToolbar";

interface EditFileViewProps {
    file: UiFile;
    parseFileTextToHTML: (
        content: string,
        onImageClick: (imageUrl: string) => void | null,
        isFileTreeOpened: boolean) => React.ReactNode[],
    isFileTreeOpened: boolean,
    onImageClick: (imageUrl: string) => void | null;
}

const EditMode: React.FC<EditFileViewProps> = (
    {
        file,
        parseFileTextToHTML,
        onImageClick,
        isFileTreeOpened,
    }
) => {
    const {fileState} = useAppContext();
    const loggedInUser = useSelector((state: RootState) => state.user.loggedInUser);

    const isSaving = useSelector(
        (state: RootState) => state.fileUi.isSaving
    );

    const {
        contentError,
        setIsFileContentChanged,
        setContentError,
        handleSaveEditedFileChanges,
        handleCancelEditedFileChanges,
    } = fileState


    const {
        textareaRef, textareaContent, setTextareaContent,
        pasteTag, wrapSelection, handleChangeTextareaContent
    } = useEditorTextarea(
        file.content ?? '',
        setIsFileContentChanged
    );

    const debouncedTextareaContent = useDebouncedValue(textareaContent, 300);

    const amountOfImagesInTextArea = useMemo(
        () => extractImagesName(debouncedTextareaContent),
        [debouncedTextareaContent]
    );

    const previewContent = useEditorPreview(
        debouncedTextareaContent,
        parseFileTextToHTML,
        onImageClick,
        isFileTreeOpened
    );

    useEditorValidation(
        textareaContent,
        amountOfImagesInTextArea,
        loggedInUser,
        setContentError
    );

    const replaceImageTag = useCallback(
        (tempName: string, realName: string) => {
            setTextareaContent(prev =>
                prev.replace(
                    `[image/${tempName}]`,
                    `[image/${realName}]`
                )
            );
        },
        [setTextareaContent]
    );

    const {
        fileInputRef,
        addedImagesWhileEditing,
        setAddedImagesWhileEditing,
        handleOpenFileDialog,
        changeFileHandler
    } = useEditorImages({
        fileId: file.id,
        pasteTag,
        replaceImageTag,
        contentError,
        initialContent: file.content ?? '',
    });

    const toolbar = createEditorToolbar(
        wrapSelection,
        pasteTag,
        handleOpenFileDialog
    );

    const handleSaveEdition = useCallback((
            newContent: string,
            addedImages: string[],
        ) => {
            if (!file) return;
            try {
                handleSaveEditedFileChanges(
                    file.id as number,
                    newContent,
                    addedImages,
                    loggedInUser?.email
                );
                setAddedImagesWhileEditing([])
            } catch (error) {
                console.error('Save failed:', error);
            }
        }
        , [file, handleSaveEditedFileChanges, loggedInUser?.email, setAddedImagesWhileEditing]);

    const handleCancelEdition = useCallback(async (
        addedImages: string[],
        contentBeforeEdition: string,
    ) => {
        try {
            await handleCancelEditedFileChanges(contentBeforeEdition, addedImages);
            setAddedImagesWhileEditing([])
        } catch (error) {
            console.error('Cancel failed:', error);
        }
    }, [handleCancelEditedFileChanges, setAddedImagesWhileEditing])

    return (
        <div className={styles['edit-mode']}>
            <div className={styles['edit-mode__header']}>
                <div className={styles['header__edit-buttons']}>
                    <EditorToolbar toolbar={toolbar}/>
                    <input
                        type="file"
                        accept="image/*"
                        style={{display: 'none'}}
                        ref={fileInputRef}
                        onChange={changeFileHandler}
                    />
                </div>
                <div className={styles['header__action-buttons']}>
                    <button
                        className={styles['header__action-buttons-save']}
                        onClick={() => handleSaveEdition(
                            textareaContent,
                            addedImagesWhileEditing)}
                        disabled={isSaving}
                    >{isSaving ? 'Saving…' : 'Save'}
                    </button>
                    <button
                        onClick={() => handleCancelEdition(
                            addedImagesWhileEditing,
                            file.content ?? '')}
                        className={styles['header__action-buttons-cancel']}>Cancel
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
                <div className={styles['edit-mode__error']}>{contentError}</div>
                <div className={styles['body__preview']}>
                    <div className={styles['body__preview-title']}>Preview</div>
                    <div
                        className={styles['body__preview-content']}>{previewContent}</div>
                </div>
            </div>
            <SwitchWhileEditModal
                contentBeforeEdition={file.content ?? ''}
                onCancelEditedFileChange={handleCancelEdition}
                addedImagesWhileEditing={addedImagesWhileEditing}/>
        </div>
    );
};

export default EditMode;