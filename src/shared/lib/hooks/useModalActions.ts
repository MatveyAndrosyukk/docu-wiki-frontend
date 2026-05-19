import {Dispatch, Ref, SetStateAction, useCallback, useEffect, useRef, useState} from "react";
import {
    checkNameConflictInFolder,
    countFilesRecursively,
    createFilePayload,
    isNameExistsInRoot
} from "../utils/modalUtils";
import {createFile} from "../../../store/thunks/files/createFile";
import useCopyPasteActions, {CopyPasteState} from "./useCopyPasteActions";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../store";
import {updateUserFilesCount} from "../../../store/slices/userSlice";
import {FileType} from "../../../types/file";
import {UiFile} from "../../../store/types/UiFile";
import {findFileById} from "../../../store/utils/fileTreeActionUtils";
import {addPendingFile, addPendingRootFolder, openFolder} from "../../../store/slices/fileUiSlice";
import {updateFileName} from "../../../store/thunks/files/updateFileName";
import {selectFileTree} from "../../../store/selectors/selectFileTree";
import {isUserAdminOrOwner} from "../utils/permissions-utils/isUserAdminOrOwner";

export enum ActionType {
    RenameFile = "RenameFile",
    AddRootFolder = "AddRootFolder",
    AddFolder = "AddFolder",
    PasteFile = "PasteFile",
    AddFile = "AddFile"
}

export interface ModalOpenState {
    reason: ActionType | null;
    id: number | null;
    title: string | null;
    defaultValue?: string;
}

export type ModalActionsState = CopyPasteState & {
    isModalOpen: boolean;
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    modalValue: string,
    modalError: string,
    isLimitError: boolean,
    setIsLimitError: Dispatch<SetStateAction<boolean>>;
    setModalError: Dispatch<SetStateAction<string>>
    setModalValue: Dispatch<SetStateAction<string>>;
    modalOpenState: ModalOpenState;
    setModalOpenState: Dispatch<SetStateAction<ModalOpenState>>;
    modalInputRef: Ref<HTMLInputElement | null> | null;
    isNameConflictReason: () => boolean;
    handleOpenRenameModal: (file: UiFile) => void;
    handleCloseModal: () => void;
    handleConfirmModalByReason: (modalState: ModalOpenState & { title: string }) => void;
    handleOpenModalByReason: (modalState: ModalOpenState) => void;
}

export default function useModalActions(): ModalActionsState {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [modalValue, setModalValue] = useState<string>('');
    const [pendingPasteId, setPendingPasteId] = useState<number | null>(null);
    const [modalError, setModalError] = useState<string>('');
    const [modalOpenState, setModalOpenState] = useState<ModalOpenState>({reason: null, id: null, title: null});
    const [isLimitError, setIsLimitError] = useState<boolean>(false);

    const viewedUser = useSelector((state: RootState) => state.user.viewedUser);
    const files = useSelector(selectFileTree);
    const totalFiles = useSelector(
        (state: RootState) => state.user.viewedUser?.amountOfFiles ?? 0
    );
    const loggedInUser = useSelector(
        (state: RootState) => state.user.loggedInUser
    );

    const dispatch = useDispatch<AppDispatch>();

    const modalInputRef = useRef<HTMLInputElement>(null);

    const filesLimit = 20;

    const openModal = useCallback((modalState: ModalOpenState) => {
        setModalOpenState(modalState);

        if (modalState.reason === ActionType.RenameFile && modalState.id) {
            const node = findFileById(files, modalState.id);
            setModalValue(node?.name || '');
        } else if (modalState.defaultValue) {
            setModalValue(modalState.defaultValue);
        } else {
            setModalValue('');
        }

        setIsModalOpen(true);
    }, [files]);

    const copyPasteActions = useCopyPasteActions(openModal);

    const closeModal = useCallback(() => {
        setModalValue('');
        setModalError('')
        setIsModalOpen(false);
        const modalState = {
            reason: null,
            id: null,
            title: null
        }
        setModalOpenState(modalState);
    }, []);

    useEffect(() => {
        if (isModalOpen && modalInputRef.current) {
            modalInputRef.current.focus();
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (pendingPasteId !== null && copyPasteActions.copiedFile) {
            copyPasteActions.handlePasteFile(pendingPasteId);
            setPendingPasteId(null);
        }
    }, [pendingPasteId, copyPasteActions]);

    useEffect(() => {
        if (
            modalOpenState.reason === ActionType.PasteFile &&
            modalOpenState.id &&
            copyPasteActions.copiedFile
        ) {
            const trimmedTitle = modalValue.trim();

            if (!trimmedTitle) {
                setModalError('');
                return;
            }

            if (checkNameConflictInFolder(files, modalOpenState.id, trimmedTitle)) {
                const typeLabel =
                    copyPasteActions.copiedFile.type === FileType.File
                        ? 'File'
                        : 'Folder';

                setModalError(`${typeLabel} with this name exists`);
            } else {
                setModalError('');
            }
        }
    }, [
        modalValue,
        modalOpenState,
        files,
        copyPasteActions.copiedFile
    ]);

    const confirmModal = useCallback(async (
        modalState: ModalOpenState & { title: string }
    ) => {
        const {reason, id, title} = modalState;
        const trimmedTitle = title.trim();

        if (!trimmedTitle) return;

        switch (reason) {
            case ActionType.AddRootFolder: {
                if (isNameExistsInRoot(files, trimmedTitle)) {
                    setModalError('Folder with this name exists');
                    return;
                }

                const tempId = Date.now();

                dispatch(addPendingRootFolder({
                    tempId,
                    name: trimmedTitle,
                }));

                dispatch(
                    createFile({
                        ...createFilePayload(
                            trimmedTitle,
                            FileType.Folder,
                            null,
                            viewedUser?.email ?? 'unknown'
                        ),
                        tempId,
                    })
                );

                closeModal();
                return;
            }

            case ActionType.AddFolder: {
                if (checkNameConflictInFolder(files, id, trimmedTitle)) {
                    setModalError('Folder with this name exists');
                    return;
                }

                const tempId = Date.now();

                dispatch(openFolder(id as number));
                dispatch(addPendingFile({
                    tempId,
                    parentId: id,
                    name: trimmedTitle,
                }));

                dispatch(
                    createFile({
                        ...createFilePayload(
                            trimmedTitle,
                            FileType.Folder,
                            id,
                            viewedUser?.email ?? 'unknown'
                        ),
                        tempId,
                    })
                );

                closeModal();
                return;
            }

            case ActionType.AddFile: {
                if (checkNameConflictInFolder(files, id, trimmedTitle)) {
                    setModalError('File with this name exists');
                    return;
                }

                if (!isUserAdminOrOwner(loggedInUser) && totalFiles >= filesLimit) {
                    closeModal();
                    setIsLimitError(true)
                    setTimeout(() => {
                        setIsLimitError(false);
                    }, 3000);
                    return;
                }

                const tempId = Date.now();

                dispatch(openFolder(id as number));
                dispatch(addPendingFile({
                    tempId,
                    parentId: id,
                    name: trimmedTitle,
                }));
                dispatch(updateUserFilesCount({
                    email: viewedUser?.email ?? 'unknown',
                    delta: +1
                }));

                closeModal();
                dispatch(
                    createFile({
                        ...createFilePayload(
                            trimmedTitle,
                            FileType.File,
                            id,
                            viewedUser?.email ?? 'unknown'
                        ),
                        tempId
                    })).unwrap()
                    .catch(() => {
                        dispatch(updateUserFilesCount({
                            email: viewedUser?.email ?? 'unknown',
                            delta: -1
                        }));
                    });

                return;
            }

            case ActionType.RenameFile: {
                const node = findFileById(files, id as number);

                const parentId = node?.parent ?? null;

                if (checkNameConflictInFolder(files, parentId, trimmedTitle)) {
                    if (node?.name !== trimmedTitle) {
                        setModalError('File with this name exists');
                        return;
                    }
                }

                dispatch(updateFileName({
                    id: id as number,
                    name: trimmedTitle,
                    viewedUserEmail: viewedUser?.email as string,
                    loggedInUserEmail: loggedInUser?.email ?? null,
                }));

                closeModal();
                return;
            }
            case ActionType.PasteFile: {
                if (!copyPasteActions.copiedFile) return;

                if (!isUserAdminOrOwner(loggedInUser) && totalFiles >= filesLimit) {
                    closeModal();
                    setIsLimitError(true)
                    setTimeout(() => {
                        setIsLimitError(false);
                    }, 3000);
                    return;
                }

                if (checkNameConflictInFolder(files, id, trimmedTitle)) {
                    const typeLabel =
                        copyPasteActions.copiedFile?.type === FileType.File
                            ? 'File'
                            : 'Folder';

                    setModalError(`${typeLabel} with this name exists`);
                    return;
                }

                let filesToAdd = 0;

                if (copyPasteActions.copiedFile.type === FileType.File) {
                    filesToAdd = 1;
                } else {
                    filesToAdd = countFilesRecursively(copyPasteActions.copiedFile);
                }

                if (totalFiles + filesToAdd > filesLimit) {
                    closeModal();
                    setIsLimitError(true)
                    setTimeout(() => {
                        setIsLimitError(false);
                    }, 3000);
                    return;
                }

                const tempId = Date.now();

                dispatch(openFolder(id as number));
                dispatch(addPendingFile({
                    tempId,
                    parentId: id,
                    name: trimmedTitle,
                }));
                dispatch(updateUserFilesCount({
                    email: viewedUser?.email ?? 'unknown',
                    delta: +filesToAdd
                }));

                closeModal();

                dispatch(
                    createFile({
                        ...copyPasteActions.copiedFile,
                        name: trimmedTitle,
                        parent: id,
                        tempId,
                        targetUserEmail: viewedUser?.email ?? 'unknown',
                    })
                ).unwrap()
                    .catch(() => {
                        dispatch(updateUserFilesCount({
                            email: viewedUser?.email ?? 'unknown',
                            delta: -filesToAdd
                        }));
                    });
                return;
            }

            default:
                return;
        }
    }, [files, dispatch, viewedUser?.email, closeModal, loggedInUser, totalFiles, copyPasteActions.copiedFile]);


    const handleOpenRenameModal = useCallback((file: UiFile) => {
        const modalState = {
            reason: ActionType.RenameFile,
            id: file.id,
            title: 'Rename file'
        }
        openModal(modalState);
        setModalValue(file.name);
    }, [openModal]);

    const isNameConflictReason = useCallback(() => {
        return modalError !== '';
    }, [modalError]);

    return {
        ...copyPasteActions,
        isModalOpen,
        setIsModalOpen,
        modalValue,
        modalError,
        setModalError,
        setModalValue,
        modalOpenState,
        setModalOpenState,
        modalInputRef,
        handleConfirmModalByReason: confirmModal,
        handleOpenModalByReason: openModal,
        handleOpenRenameModal,
        handleCloseModal: closeModal,
        isNameConflictReason,
        isLimitError,
        setIsLimitError,
    };
}