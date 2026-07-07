import {RefObject} from "react";

export type LoginModalValue = {

    login: string;

    password: string;

};

export type LoginState = {

    isModalOpen: boolean;

    loading: boolean;

    error: string | null;

    message: string | null;

    value: LoginModalValue;

    inputRef?: RefObject<HTMLInputElement | null>;
};

export const initialState: LoginState = {

    isModalOpen: false,

    loading: false,

    error: null,

    message: null,

    value: {
        login: "",

        password: "",
    },

};

type LoginActions = {

    login(): Promise<void>;

    logout(): void;

    openModal(): void;

    closeModal(): void;

    reset(): void;

    setValue(
        value: Partial<LoginModalValue>
    ): void;

    setError(
        error: string | null
    ): void;

    setMessage(
        message: string | null
    ): void;
};

export type LoginActionsState = {

    state: LoginState;

    actions: LoginActions;

};