import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {ChangeFileLikesPayload, toggleFileLikes} from "../../../store/thunks/files/toggleFileLikes";
import useDeleteModalActions from "./use-delete-modal-actions/useDeleteModalActions";
import useEditModalActions, {
    ModalActionsState
} from "../../ui/modal-windows/edit-modal/hooks/edit-modal-actions/useEditModalActions";
import useEditFileActions, {EditFileViewState} from "./useEditFileActions";
import {useCallback} from "react";
import {PremiumState} from "../../ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";
import {DeleteModalActionsState} from "./use-delete-modal-actions/delete-file.types";

export type FileActionsState = ModalActionsState & EditFileViewState & {
    handleLikeFile: (dto: ChangeFileLikesPayload) => any;
    deleteModal: DeleteModalActionsState;
}

export default function useFilesActions(
    premiumState: PremiumState
): FileActionsState {
    const deleteModal = useDeleteModalActions();

    const modalState = useEditModalActions(
        premiumState,
        deleteModal.actions.open
    );
    const editFileState = useEditFileActions();

    const dispatch = useDispatch<AppDispatch>();

    const handleLikeFile = useCallback((dto: ChangeFileLikesPayload) => {
        return dispatch(toggleFileLikes(dto));
    }, [dispatch]);

    return {
        ...modalState,
        ...editFileState,
        deleteModal,
        handleLikeFile,
    }
}