import {RemoveFileActionsState} from "./hooks/use-remove-file-handler/remove-file.types";
import {ContextMenuHandlerState} from "./hooks/use-context-menu-handler/context-menu.types";
import {FileActionsHandlerStateActions} from "./hooks/use-file-actions-hanler/file-actions-handler.types";
import {FileLikesActionsState} from "./hooks/use-file-likes-handler/file-likes.types";

export type FilesState = {

    fileRemoveHandler: RemoveFileActionsState;

    fileActionsHandler: FileActionsHandlerStateActions;

    fileLikesHandler: FileLikesActionsState;

    contextMenuHandler: ContextMenuHandlerState;
};