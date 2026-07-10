import {UiFile} from "../../../../../../store/types/UiFile";
import {User} from "../../../../../../store/slices/userSlice";

export type RemoveFileState = {

    file: UiFile | null;

    user: User | null;

    open: boolean;

    isDeleting: boolean;

};

export type RemoveFileActions = {

    open(
        file: UiFile,
        user: User | null
    ): void;

    close(): void;

    confirm(): Promise<void>;

};

export type RemoveFileActionsState = {

    state: RemoveFileState;

    actions: RemoveFileActions;

};

export const initialState: RemoveFileState = {
    open: false,
    file: null,
    user: null,
    isDeleting: false,
};