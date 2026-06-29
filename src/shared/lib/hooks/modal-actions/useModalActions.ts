import {Ref, useCallback, useMemo, useReducer, useRef} from "react";
import useCopyPasteActions, {CopyPasteState} from "../useCopyPasteActions";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../../../../store";
import {UiFile} from "../../../../store/types/UiFile";
import {selectFileTree} from "../../../../store/selectors/selectFileTree";
import {PremiumState} from "../../../ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";
import {getModalInitialValue} from "./utils/getModalInitialValue";
import {useModalFocusEffect} from "./effects/useModalFocusEffect";
import {usePendingPasteEffect} from "./effects/usePendingPasteEffect";
import {usePasteNameValidation} from "./effects/usePasteNameValidation";
import {ModalActionContext} from "./types/ModalActionContext";
import {confirmModalAction} from "./actions/confirmModalAction";
import {ActionType} from "./types/ActionType";
import {OpenModalState} from "./types/OpenModalState";
import {filesLimit} from "./constants/filesLimit";
import {useNameLengthValidation} from "./effects/useNameLengthValidation";

export type ModalActionsState = {
    modal: {
        isOpen: boolean;
        value: string;
        error: string;
        isLimitError: boolean;
        openState: OpenModalState;
        pendingPasteId: number | null;
        inputRef: Ref<HTMLInputElement | null> | null;
    };

    actions: {
        open: (openState: OpenModalState, value?: string) => void;
        close: () => void;
        confirm: (modalState: OpenModalState & { title: string }) => void;
        openRename: (file: UiFile) => void;
        setValue: (value: string) => void;
        setError: (value: string) => void;
    };

    copyPaste: CopyPasteState;

    helpers: {
        isNameConflictReason: boolean;
    };
};

type ModalState = {
    isOpen: boolean;
    value: string;
    error: string;
    isLimitError: boolean;
    openState: OpenModalState;
    pendingPasteId: number | null;
};

type ModalAction =
    | { type: "OPEN"; payload: OpenModalState }
    | { type: "CLOSE" }
    | { type: "SET_VALUE"; payload: string }
    | { type: "SET_ERROR"; payload: string }
    | { type: "SET_LIMIT_ERROR"; payload: boolean }
    | { type: "SET_PENDING_PASTE"; payload: number | null }
    | { type: "RESET" };

export default function useModalActions(
    premiumState: PremiumState
): ModalActionsState {
    const initialModalState: ModalState = {
        isOpen: false,
        value: '',
        error: '',
        isLimitError: false,
        openState: {
            reason: null,
            id: null,
            title: null,
        },
        pendingPasteId: null,
    };

    function modalReducer(state: ModalState, action: ModalAction): ModalState {
        switch (action.type) {

            case "OPEN":
                return {
                    ...state,
                    isOpen: true,
                    openState: action.payload,
                };

            case "CLOSE":
                return {
                    ...state,
                    isOpen: false,
                    value: '',
                    error: '',
                    openState: initialModalState.openState,
                };

            case "SET_VALUE":
                return {
                    ...state,
                    value: action.payload,
                };

            case "SET_ERROR":
                return {
                    ...state,
                    error: action.payload,
                };

            case "SET_LIMIT_ERROR":
                return {
                    ...state,
                    isLimitError: action.payload,
                };

            case "SET_PENDING_PASTE":
                return {
                    ...state,
                    pendingPasteId: action.payload,
                };

            case "RESET":
                return initialModalState;

            default:
                return state;
        }
    }

    const [modalState, dispatchModal] = useReducer(
        modalReducer,
        initialModalState
    );

    const modalInputRef =
        useRef<HTMLInputElement>(null);

    const dispatch = useDispatch<AppDispatch>();

    const files = useSelector(selectFileTree);

    const viewedUser = useSelector(
        (state: RootState) => state.user.viewedUser
    );

    const totalFiles = useSelector(
        (state: RootState) => state.user.viewedUser?.amountOfFiles ?? 0
    );

    const loggedInUser = useSelector(
        (state: RootState) => state.user.loggedInUser
    );

    const isNameConflictReason = modalState.error !== '';

    const openModal = useCallback(
        (openState: OpenModalState, value?: string) => {

            dispatchModal({
                type: "OPEN",
                payload: openState,
            });

            dispatchModal({
                type: "SET_VALUE",
                payload:
                    value ?? getModalInitialValue(files, openState),
            });

        },
        [files]
    );

    const copyPasteActions = useCopyPasteActions(openModal);

    const {
        copiedFile,
        handlePasteFile
    } = copyPasteActions;

    const closeModal = useCallback(() => {
        dispatchModal({type: "CLOSE"});
    }, []);

    const actionContext = useMemo<ModalActionContext>(
        () => ({
            files,
            dispatch,
            viewedUserEmail:
                viewedUser?.email ?? "unknown",
            loggedInUserEmail:
                loggedInUser?.email ?? null,
            loggedInUser,
            totalFiles,
            filesLimit,
            premiumState,
            closeModal,
            setModalError: (
                value: string
            ) =>
                dispatchModal({
                    type: "SET_ERROR",
                    payload: value,
                }),
        }),
        [
            files,
            dispatch,
            viewedUser?.email,
            loggedInUser,
            totalFiles,
            premiumState,
            closeModal,
        ]
    );

    const confirmModal = useCallback(
        (
            modalState: OpenModalState & {
                title: string;
            }
        ) =>
            confirmModalAction({
                modalState,
                copiedFile,
                context: actionContext,
            }),
        [
            copiedFile,
            actionContext,
        ]
    );


    const handleOpenRenameModal = useCallback((file: UiFile) => {
        openModal(
            {
                reason: ActionType.RenameFile,
                id: file.id,
                title: 'Rename file'
            },
            file.name
        );

    }, [openModal]);

    const setModalValue = useCallback((value: string) => {
        dispatchModal({
            type: "SET_VALUE",
            payload: value,
        });
    }, []);

    const setModalError = useCallback((value: string) => {
        dispatchModal({
            type: "SET_ERROR",
            payload: value,
        });
    }, []);

    usePasteNameValidation(
        {
            modalValue: modalState.value,
            modalOpenState: modalState.openState,
            files,
            copiedFile,
            setModalError
        }
    );

    usePendingPasteEffect(
        {
            pendingPasteId: modalState.pendingPasteId,
            copiedFile,
            handlePasteFile,
            clearPendingPaste: () =>
                dispatchModal({
                    type: "SET_PENDING_PASTE",
                    payload: null,
                }),
        }
    );

    useModalFocusEffect(
        modalState.isOpen,
        modalInputRef
    );

    useNameLengthValidation({
        value: modalState.value,
        error: modalState.error,
        setError: setModalError,
    });

    const modal = {
        isOpen: modalState.isOpen,
        value: modalState.value,
        error: modalState.error,
        isLimitError: modalState.isLimitError,
        openState: modalState.openState,
        pendingPasteId: modalState.pendingPasteId,
        inputRef: modalInputRef,
    };

    const actions = {
        open: openModal,
        close: closeModal,
        confirm: confirmModal,
        openRename: handleOpenRenameModal,
        setValue: setModalValue,
        setError: setModalError,
    };

    const copyPaste = {
        ...copyPasteActions,
    };

    const helpers = {
        isNameConflictReason,
    };

    return {
        modal,
        actions,
        copyPaste,
        helpers,
    };
}