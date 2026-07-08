import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {ChangeFileLikesPayload, toggleFileLikes} from "../../../store/thunks/files/toggleFileLikes";
import useRemoveFileHandler from "./use-remove-file-handler/useRemoveFileHandler";
import useFileActionsModalHandler, {
    ModalActionsState
} from "./use-file-actions-modal-handler/useFileActionsModalHandler";
import useEditFileHandler from "./use-edit-file-handler/useEditFileHandler";
import {useCallback} from "react";
import {PremiumState} from "../../ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";
import {RemoveFileActionsState} from "./use-remove-file-handler/remove-file.types";
import {EditFileActionsState} from "./use-edit-file-handler/edit-file.types";

export type FileActionsState = ModalActionsState & {
    handleLikeFile: (dto: ChangeFileLikesPayload) => any;
    deleteModal: RemoveFileActionsState;
    fileEditor: EditFileActionsState;
}

export default function useFilesHandler(
    premiumState: PremiumState
): FileActionsState {
    const removeFileHandler = useRemoveFileHandler();

    const editModalHandler = useFileActionsModalHandler(
        premiumState,
        removeFileHandler.actions.open
    );
    const editFileHandler = useEditFileHandler();

    const reduxDispatch = useDispatch<AppDispatch>();

    const handleLikeFile = useCallback((dto: ChangeFileLikesPayload) => {
        return reduxDispatch(toggleFileLikes(dto));
    }, [reduxDispatch]);

    return {
        ...editModalHandler,
        fileEditor: editFileHandler,
        deleteModal: removeFileHandler,
        handleLikeFile,
    }
}