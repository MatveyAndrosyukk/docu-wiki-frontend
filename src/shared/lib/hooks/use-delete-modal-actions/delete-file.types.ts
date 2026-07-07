import {UiFile} from "../../../../store/types/UiFile";
import {User} from "../../../../store/slices/userSlice";

export type DeleteModalState = {
    file: UiFile | null;
    user: User | null;
    open: boolean;
    isDeleting: boolean;
};

export type DeleteModalActions = {
    open(
        file: UiFile,
        user: User | null
    ): void;

    close(): void;

    confirm(): Promise<void>;
};

export type DeleteModalActionsState = {
    state: DeleteModalState;
    actions: DeleteModalActions;
};

export const initialState: DeleteModalState = {
    open: false,
    file: null,
    user: null,
    isDeleting: false,
};