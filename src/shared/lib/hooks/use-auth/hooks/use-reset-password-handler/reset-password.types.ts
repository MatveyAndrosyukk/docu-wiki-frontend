import {ChangeEvent, RefObject} from "react";

export type ResetPasswordValue = {
    newPassword: string;

    repeatPassword: string;
};

export type ResetPasswordState = {
    isModal: boolean;

    loading: boolean;

    error: string;

    message: string;

    value: ResetPasswordValue;

    newPasswordInputRef: RefObject<HTMLInputElement | null>;
};

export type ResetPasswordActions = {
    openModal(): void;

    closeModal(): void;

    setLoading(value: boolean): void;

    setError(value: string): void;

    setMessage(value: string): void;

    setValue(value: Partial<ResetPasswordValue>): void;

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

export const initialState: ResetPasswordState = {
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

export type ResetPasswordActionsState = {
    state: ResetPasswordState;

    actions: ResetPasswordActions;
};