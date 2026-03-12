import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../store";
import {ChangeFileLikesPayload, toggleFileLikes} from "../../../store/thunks/files/toggleFileLikes";
import useDeleteFileActions, {DeleteFileState} from "./useDeleteFileActions";
import useModalActions, {ModalActionsState} from "./useModalActions";
import useEditFileActions, {EditFileViewState} from "./useEditFileActions";
import {useCallback} from "react";

export type FileActionsState = DeleteFileState & ModalActionsState & EditFileViewState & {
    handleLikeFile: (dto: ChangeFileLikesPayload) => any;
}

export default function useFilesActions(): FileActionsState {
    const dispatch = useDispatch<AppDispatch>();
    const deleteFileState = useDeleteFileActions();
    const modalState = useModalActions();
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