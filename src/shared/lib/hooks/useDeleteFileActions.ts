import {useCallback, useState} from "react";
import {deleteFileById} from "../../../store/thunks/files/deleteFileById";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {updateUserFilesCount, User} from "../../../store/slices/userSlice";
import {UiFile} from "../../../store/types/UiFile";
import {FileType} from "../../../types/file";
import {countFilesRecursively} from "../utils/modalUtils";

export interface DeleteModalState {
    open: boolean;
    file: UiFile | null;
    user: User | null;
    isDeleting: boolean;
}

export type OpenDeleteModal = (
    file: UiFile,
    user: User | null
) => void;

export interface DeleteFileState {
    deleteModalState: DeleteModalState;
    handleOpenDeleteModal: OpenDeleteModal;
    handleConfirmDeleteFile: () => void;
    handleCancelDeleteFile: () => void;
}

export default function useDeleteFileActions(): DeleteFileState {
    const dispatch = useDispatch<AppDispatch>();

    const viewedUser = useSelector((state: RootState) => state.user.viewedUser);

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

        let filesToSubtract = 0;

        if (deletedFile.type === FileType.File) {
            filesToSubtract = 1;
        } else {
            filesToSubtract = countFilesRecursively(deletedFile);
        }

        dispatch(updateUserFilesCount({
            email: viewedUser?.email ?? 'unknown',
            delta: -filesToSubtract
        }));

        setDeleteModalState({
            open: false,
            file: null,
            user: null,
            isDeleting: true
        });


        dispatch(deleteFileById({file: deletedFile, email: userEmail}))
            .unwrap()
            .catch(() => {
                dispatch(updateUserFilesCount({
                    email: viewedUser?.email ?? 'unknown',
                    delta: +filesToSubtract
                }));
            });


        setDeleteModalState({
            open: false,
            file: null,
            user: null,
            isDeleting: false
        });
    }, [deleteModalState.file, deleteModalState.user?.email, dispatch, viewedUser?.email]);

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