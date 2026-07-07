import {ChangeEvent, RefObject} from "react";

export type EmailState = {

    error: string;

    inputRef?: RefObject<HTMLInputElement | null>;

    isModal: boolean;

    loading: boolean;

    message: string;

    value: string;
};

export type EmailActions = {
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

export type EmailActionsState = {
    state: EmailState;

    actions: EmailActions;
};

export const initialState: EmailState = {
    isModal: false,
    loading: false,
    error: "",
    message: "",
    value: "",
};