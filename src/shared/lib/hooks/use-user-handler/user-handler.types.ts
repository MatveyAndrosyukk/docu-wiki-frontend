import {RefObject} from "react";
import {User} from "../../../../store/slices/userSlice";

export type UserHandlerState = {

    isAddingEditor: boolean;

    isChangingName: boolean;

    isEditingName: boolean;

    editedName: string;

    isModalOpen: boolean;

    modalValue: string;

    editors: User[];

    nameInputRef: RefObject<HTMLInputElement | null>;

    modalInputRef: RefObject<HTMLInputElement | null>;

    editedNameError: string;

    addEditorError: string;

    changeNameError: string;

};

export type UserHandlerActions = {

    startEditingName(): void;

    cancelEditingName(): void;

    updateEditedName(
        value: string
    ): void;

    updateModalValue(
        value: string
    ): void;

    openModal(): void;

    closeModal(): void;

    addEditor(): Promise<void>;

    deleteEditor(
        targetEmail: string,
        event: React.MouseEvent<HTMLButtonElement>
    ): void;

    confirmNameEdition(): Promise<void>;

    keyDownWhileEditing(
        e: React.KeyboardEvent<HTMLInputElement>
    ): Promise<void>;

    blurNameAfterEdition(): void;

};

export type UserHandlerActionsState = {

    state: UserHandlerState;

    actions: UserHandlerActions;

};

export const initialState: Omit<
    UserHandlerState,
    "nameInputRef" | "modalInputRef"
> = {

    isAddingEditor: false,

    isChangingName: false,

    isEditingName: false,

    editedName: "",

    isModalOpen: false,

    modalValue: "",

    editors: [],

    editedNameError: "",

    addEditorError: "",

    changeNameError: "",

};