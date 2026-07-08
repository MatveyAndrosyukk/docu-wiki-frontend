import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {ChangeFileLikesPayload, toggleFileLikes} from "../../../store/thunks/files/toggleFileLikes";
import useRemoveFileHandler from "./use-remove-file-handler/useRemoveFileHandler";
import useEditModalActions, {
    ModalActionsState
} from "../../ui/modal-windows/edit-modal/hooks/edit-modal-actions/useEditModalActions";
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

export default function useFilesActions(
    premiumState: PremiumState
): FileActionsState {
    const deleteModal = useRemoveFileHandler();

    const modalState = useEditModalActions(
        premiumState,
        deleteModal.actions.open
    );
    const editFile = useEditFileHandler();

    const dispatch = useDispatch<AppDispatch>();

    const handleLikeFile = useCallback((dto: ChangeFileLikesPayload) => {
        return dispatch(toggleFileLikes(dto));
    }, [dispatch]);

    return {
        ...modalState,
        fileEditor: editFile,
        deleteModal,
        handleLikeFile,
    }
}