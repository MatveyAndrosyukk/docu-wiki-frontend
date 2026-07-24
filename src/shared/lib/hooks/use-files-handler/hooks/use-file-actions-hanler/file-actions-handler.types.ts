import {RefObject} from "react";
import {ContextMenuHandlerState} from "../use-context-menu-handler/context-menu.types";
import {UiFile} from "../../../../../../store/types/UiFile";
import {AppDispatch} from "../../../../../../store";
import {User} from "../../../../../../store/slices/userSlice";
import {PremiumState} from "../../../../../ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";

export enum ActionType {
    RenameFile = "RenameFile",
    AddRootFolder = "AddRootFolder",
    AddFolder = "AddFolder",
    PasteFile = "PasteFile",
    AddFile = "AddFile"
}

export interface ActionModalState {
    reason: ActionType | null;
    id: number;
    title: string;
    defaultValue?: string;
}

export type FileActionsHandlerState = {

    isOpen: boolean;

    value: string;

    error: string;

    isLimitError: boolean;

    modalState: ActionModalState;

    pendingPasteId: number | null;

    inputRef?: RefObject<HTMLInputElement | null>;

};

export type FileActionsHandlerActions = {
    open(
        openState: ActionModalState,
        value?: string
    ): void;

    close(): void;

    confirm(
        modalState: ActionModalState & {
            title: string;
        }
    ): void;

    setValue(
        value: string
    ): void;

    setError(
        value: string
    ): void;

    clearPendingPaste(): void;
};

export type FileActionsHandlerStateActions = {

    state: FileActionsHandlerState;

    actions: FileActionsHandlerActions;

    contextMenuHandler: ContextMenuHandlerState;

};

export const initialState: FileActionsHandlerState = {

    isOpen: false,

    value: "",

    error: "",

    isLimitError: false,

    modalState: {

        reason: null,

        id: 0,

        title: '',

    },

    pendingPasteId: null,

};

export interface FileActionsHandlerContext {

    files: UiFile[];

    dispatch: AppDispatch;

    viewedUserEmail: string;

    loggedInUser: User | null;

    viewedUser: User | null;

    totalFiles: number;

    filesLimit: number;

    premiumHandler: PremiumState;

    closeModal: () => void;

    setModalError: (value: string) => void;

    loggedInUserEmail: string | null;
}