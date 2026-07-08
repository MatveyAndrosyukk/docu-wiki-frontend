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
    EditorParams,
    EditorState,
} from "./editor.types";
import {createEditorToolbar} from "../../utils/createEditorToolbar";

export default function useEditorHandler(
    {
        editHandler,
        fileId,
        initialContent,
        contentError,
        loggedInUser,
    }: EditorParams
): EditorState {

    const textareaHandler =
        useTextareaHandler(
            {
                initialContent,
                setIsFileContentChanged:
                editHandler.actions.setIsFileContentChanged,
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
                fileId,
                pasteTag:
                textareaHandler.actions.pasteTag,
                replaceImageTag,
                contentError,
                initialContent,
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
                loggedInUser,
                setContentError:
                editHandler.actions.setContentError,
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

        editHandler,

        textareaHandler,

        imagesHandler,

        validationHandler,

        toolbar,
    };

}