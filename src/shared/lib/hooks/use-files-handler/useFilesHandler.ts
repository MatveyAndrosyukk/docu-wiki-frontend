import {useCallback} from "react";
import {useDispatch} from "react-redux";

import {AppDispatch} from "../../../../store";

import {
    ChangeFileLikesPayload,
    toggleFileLikes,
} from "../../../../store/thunks/files/toggleFileLikes";

import {PremiumState} from "../../../ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";

import {FilesState} from "./files.types";

import useRemoveFileHandler
    from "./hooks/use-remove-file-handler/useRemoveFileHandler";

import useFileActionsHandler
    from "./hooks/use-file-actions-hanler/useFileActionsHandler";

export default function useFilesHandler(
    premiumState: PremiumState
): FilesState {

    const reduxDispatch = useDispatch<AppDispatch>();

    const removeHandler = useRemoveFileHandler();

    const actionsHandler = useFileActionsHandler(
        premiumState,
        removeHandler.actions.open
    );

    const like = useCallback(
        (
            dto: ChangeFileLikesPayload
        ) => {

            return reduxDispatch(
                toggleFileLikes(dto)
            );

        },
        [
            reduxDispatch,
        ]
    );

    return {

        fileRemoveHandler: removeHandler,

        fileActionsHandler: actionsHandler,

        contextMenuHandler:
        actionsHandler.contextMenuHandler,

        like,

    };

}