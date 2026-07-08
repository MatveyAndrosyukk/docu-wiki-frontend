import {TextareaActionsState}
    from "./hooks/use-textarea-handler/textarea.types";
import {FileImagesActionsState}
    from "./hooks/use-file-images-handler/file-images.types";
import {ValidationActionsState}
    from "./hooks/use-validation-handler/validation.types";
import { EditFileActionsState } from "../use-edit-file-handler/edit-file.types";

export interface EditorParams {

    editHandler: EditFileActionsState;

    fileId: number;

    initialContent: string;

    contentError: string;

    loggedInUser: any;

}

export interface EditorState {

    editHandler: EditFileActionsState;

    textareaHandler: TextareaActionsState;

    imagesHandler: FileImagesActionsState;

    validationHandler: ValidationActionsState;

    toolbar: any

}