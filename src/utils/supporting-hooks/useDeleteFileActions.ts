import {useCallback, useState} from "react";
import {deleteFileById} from "../../store/thunks/files/deleteFileById";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {User} from "../../store/slices/userSlice";
import {fetchViewedUserByEmail} from "../../store/thunks/user/fetchViewedUserByEmail";
import {UiFile} from "../../store/types/UiFile";

export interface DeleteModalState {
    open: boolean;
    file: UiFile | null;
    user: User | null;
    isDeleting: boolean;
}

export interface DeleteFileState {
    deleteModalState: DeleteModalState;
    handleOpenDeleteModal: (file: UiFile, user: User | null) => void;
    handleConfirmDeleteFile: () => void;
    handleCancelDeleteFile: () => void;
}

export default function useDeleteFileActions(
    viewedUser: User | null,
): DeleteFileState {
    const dispatch = useDispatch<AppDispatch>();
    const [deleteModalState, setDeleteModalState] = useState<DeleteModalState>({
        open: false,
        file: null,
        user: null,
        isDeleting: false,
    });

    const handleOpenDeleteModal = useCallback((file: UiFile, user: User | null) => {
        setDeleteModalState({open: true, file, user, isDeleting: false});
    }, [setDeleteModalState]);

    const handleConfirmDeleteFile = useCallback(async () => {
        if (!deleteModalState.file) return;

        const deletedFile = deleteModalState.file;
        const userEmail = deleteModalState.user?.email;

        setDeleteModalState({
            open: false,
            file: null,
            user: null,
            isDeleting: true
        });

        try {
            await dispatch(deleteFileById({file: deletedFile, email: userEmail})).unwrap();

            if (viewedUser) {
                dispatch(fetchViewedUserByEmail(viewedUser.email));
            }

        } catch (error) {
            console.error('Failed to delete file', error);
            alert("Failed to delete file on server. File was restored.");
        }

        setDeleteModalState({
            open: false,
            file: null,
            user: null,
            isDeleting: false
        });
    }, [deleteModalState.file, deleteModalState.user?.email, dispatch, viewedUser]);

    const handleCancelDeleteFile = useCallback(() => {
        setDeleteModalState({
            open: false,
            file: null,
            user: null,
            isDeleting: false
        });
    }, [setDeleteModalState]);

    return {
        deleteModalState,
        handleOpenDeleteModal,
        handleConfirmDeleteFile,
        handleCancelDeleteFile,
    }
}