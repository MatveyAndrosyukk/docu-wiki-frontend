import {TextareaActionsState}
    from "./hooks/use-textarea-handler/textarea.types";
import {FileImagesActionsState}
    from "./hooks/use-file-images-handler/file-images.types";
import {ValidationActionsState}
    from "./hooks/use-validation-handler/validation.types";
import { EditFileActionsState } from "./hooks/use-edit-mode-handler/edit-mode.types";

export interface EditorState {

    editModeHandler: EditFileActionsState;

    textareaHandler: TextareaActionsState;

    imagesHandler: FileImagesActionsState;

    validationHandler: ValidationActionsState;

    toolbar: any

}