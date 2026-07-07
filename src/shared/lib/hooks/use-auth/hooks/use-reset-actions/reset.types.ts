import {ChangeEvent, RefObject} from "react";

export type ResetValue = {
    newPassword: string;

    repeatPassword: string;
};

export type ResetState = {
    isModal: boolean;

    loading: boolean;

    error: string;

    message: string;

    value: ResetValue;

    newPasswordInputRef: RefObject<HTMLInputElement | null>;
};

export const initialState: ResetState = {
    isModal: false,

    loading: false,

    error: "",

    message: "",

    value: {
        newPassword: "",
        repeatPassword: "",
    },

    newPasswordInputRef: {current: null},
};

export type ResetActions = {
    openModal(): void;

    closeModal(): void;

    setLoading(value: boolean): void;

    setError(value: string): void;

    setMessage(value: string): void;

    setValue(value: Partial<ResetValue>): void;

    setIsModal(value: boolean): void;

    reset(): void;

    handleChangeNewPassword(
        e: ChangeEvent<HTMLInputElement>
    ): void;

    handleChangeRepeatPassword(
        e: ChangeEvent<HTMLInputElement>
    ): void;

    blurNewPassword(): void;

    blurRepeatPassword(): void;

    resetPassword(
        resetToken: string | undefined
    ): Promise<void>;
}

export type ResetActionsState = {
    state: ResetState;

    actions: ResetActions;
};