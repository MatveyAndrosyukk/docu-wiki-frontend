import {ChangeFileLikesPayload} from "../../../../store/thunks/files/toggleFileLikes";
import {RemoveFileActionsState} from "./hooks/use-remove-file-handler/remove-file.types";
import {ContextMenuHandlerState} from "./hooks/use-context-menu-handler/context-menu.types";
import {FileActionsHandlerStateActions} from "./hooks/use-file-actions-hanler/file-actions-handler.types";
export type FilesState = {

    fileRemoveHandler: RemoveFileActionsState;

    fileActionsHandler: FileActionsHandlerStateActions;

    contextMenuHandler: ContextMenuHandlerState;

    like: (
        dto: ChangeFileLikesPayload
    ) => any;

};