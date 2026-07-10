import {ChangeEvent, RefObject} from "react";

export type ChangeEmailState = {

    error: string;

    inputRef?: RefObject<HTMLInputElement | null>;

    isModal: boolean;

    loading: boolean;

    message: string;

    value: string;
};

export type ChangeEmailActions = {
    setLoading(
        value: boolean
    ): void;

    setError(
        value: string
    ): void;

    setMessage(
        value: string
    ): void;

    setValue(
        value: string
    ): void;

    setIsModal(
        value: boolean
    ): void;

    reset(): void;

    handleChangeEmail(
        e: ChangeEvent<HTMLInputElement>
    ): void;

    sendChangePasswordLink(): Promise<void>;
}

export type ChangeEmailActionsState = {
    state: ChangeEmailState;

    actions: ChangeEmailActions;
};

export const initialState: ChangeEmailState = {
    isModal: false,
    loading: false,
    error: "",
    message: "",
    value: "",
};