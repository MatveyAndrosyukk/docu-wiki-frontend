import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {ChangeFileLikesPayload, toggleFileLikes} from "../../../store/thunks/files/toggleFileLikes";
import useDeleteFileActions, {DeleteFileState} from "./useDeleteFileActions";
import useModalActions, {ModalActionsState} from "./modal-actions/useModalActions";
import useEditFileActions, {EditFileViewState} from "./useEditFileActions";
import {useCallback} from "react";
import {PremiumState} from "../../ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";

export type FileActionsState = DeleteFileState & ModalActionsState & EditFileViewState & {
    handleLikeFile: (dto: ChangeFileLikesPayload) => any;
}

export default function useFilesActions(
    premiumState: PremiumState
): FileActionsState {
    const dispatch = useDispatch<AppDispatch>();
    const deleteFileState = useDeleteFileActions();
    const modalState = useModalActions(premiumState);
    const editFileState = useEditFileActions();

    const handleLikeFile = useCallback((dto: ChangeFileLikesPayload) => {
        return dispatch(toggleFileLikes(dto));
    }, [dispatch]);

    return {
        ...modalState,
        ...deleteFileState,
        ...editFileState,
        handleLikeFile,
    }
}