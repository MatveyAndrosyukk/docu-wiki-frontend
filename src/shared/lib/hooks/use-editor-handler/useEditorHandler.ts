import {useMemo} from "react";
import extractImagesName
    from "../../utils/extractImageNames";
import useTextareaHandler
    from "./hooks/use-textarea-handler/useTextareaHandler";
import useFileImagesHandler
    from "./hooks/use-file-images-handler/useFileImagesHandler";
import useValidationHandler
    from "./hooks/use-validation-handler/useValidationHandler";
import {
    EditorState,
} from "./editor.types";
import {createEditorToolbar} from "../../utils/createEditorToolbar";
import useEditModeHandler from "./hooks/use-edit-mode-handler/useEditModeHandler";

export default function useEditorHandler(): EditorState {

    const editModeHandler = useEditModeHandler();

    const textareaHandler =
        useTextareaHandler(
            {
                setIsFileContentChanged:
                editModeHandler.actions.setIsFileContentChanged,
            }
        );

    const replaceImageTag = (
        tempName: string,
        realName: string,
    ) => {

        textareaHandler.actions.updateContent(
            previous =>
                previous.replace(
                    `[image/${tempName}]`,
                    `[image/${realName}]`
                )
        );

    };

    const imagesHandler =
        useFileImagesHandler(
            {
                pasteTag: textareaHandler.actions.pasteTag,
                replaceImageTag,
                contentError: editModeHandler.state.contentError,
            }
        );

    const images = useMemo(
        () =>
            extractImagesName(
                textareaHandler.state.content
            ),
        [
            textareaHandler.state.content,
        ]
    );

    const validationHandler =
        useValidationHandler(
            {
                content:
                textareaHandler.state.content,
                images,
                setContentError:
                editModeHandler.actions.setContentError,
            }
        );

    const toolbar =
        useMemo(
            () =>
                createEditorToolbar(
                    textareaHandler.actions.wrapSelection,
                    textareaHandler.actions.pasteTag,
                    imagesHandler.actions.openDialog
                ),
            [
                textareaHandler.actions.wrapSelection,
                textareaHandler.actions.pasteTag,
                imagesHandler.actions.openDialog,
            ]
        );

    return {

        editModeHandler,

        textareaHandler,

        imagesHandler,

        validationHandler,

        toolbar,
    };

}