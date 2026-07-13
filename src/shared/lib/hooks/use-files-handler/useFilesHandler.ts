import {PremiumState} from "../../../ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";

import {FilesState} from "./files.types";

import useRemoveFileHandler from "./hooks/use-remove-file-handler/useRemoveFileHandler";

import useFileActionsHandler from "./hooks/use-file-actions-hanler/useFileActionsHandler";
import {useFileLikesHandler} from "./hooks/use-file-likes-handler/useFileLikesHandler";

interface Props {
    premiumHandler: PremiumState
}

export default function useFilesHandler(
    {
        premiumHandler,
    }: Props
): FilesState {

    const fileRemoveHandler = useRemoveFileHandler();

    const fileActionsHandler = useFileActionsHandler(
        {
            premiumHandler,
            openDeleteModal: fileRemoveHandler.actions.open,
        }
    );

    const fileLikesHandler = useFileLikesHandler();

    return {

        fileRemoveHandler,

        fileActionsHandler,

        fileLikesHandler,

        contextMenuHandler:
        fileActionsHandler.contextMenuHandler,
    };

}