import {useCallback, useState} from "react";
import {deleteFileById} from "../../store/thunks/files/deleteFileById";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../store";
import {User} from "../../store/slices/userSlice";
import {fetchViewedUserByEmail} from "../../store/thunks/user/fetchViewedUserByEmail";
import {File} from "../../types/file";

export interface DeleteModalState {
    open: boolean;
    file: File | null;
    user: User | null;
    isDeleting: boolean;
}

export interface DeleteFileState {
    deleteModalState: DeleteModalState;
    handleOpenDeleteModal: (file: File, user: User | null) => void;
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

    const handleOpenDeleteModal = useCallback((file: File, user: User | null) => {
        setDeleteModalState({open: true, file, user, isDeleting: false});
    }, [setDeleteModalState]);

    const handleConfirmDeleteFile = useCallback(async () => {
        if (!deleteModalState.file) return;

        const fileId = deleteModalState.file.id;
        const userEmail = deleteModalState.user?.email;

        setDeleteModalState({
            open: false,
            file: null,
            user: null,
            isDeleting: true
        });

        try {
            dispatch(deleteFileById({
                id: fileId,
                email: userEmail
            }));

            if (viewedUser) {
                dispatch(fetchViewedUserByEmail(viewedUser.email));
            }
        } catch (error) {
            console.error('Failed to delete file.')
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