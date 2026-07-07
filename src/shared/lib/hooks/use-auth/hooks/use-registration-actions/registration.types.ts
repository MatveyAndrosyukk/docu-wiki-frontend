export interface RegisterModalValue {
    email: string;

    username: string;

    password: string;

    rePassword: string;
}

export type RegisterState = {
    loading: boolean;

    error: string | null;

    message: string | null;

    isModal: boolean;

    value: RegisterModalValue;
};

export const initialState: RegisterState = {
    loading: false,

    error: null,

    message: null,

    isModal: false,

    value: {
        email: "",

        username: "",

        password: "",

        rePassword: "",
    },
};

export type RegisterActions = {
    setValue(
        value: Partial<RegisterModalValue>
    ): void;

    setError(
        error: string | null
    ): void;

    setMessage(
        message: string | null
    ): void;

    setIsModal(
        value: boolean
    ): void;

    register(): Promise<void>;

    reset(): void;
};

export type RegisterActionsState = {

    state: RegisterState;

    actions: RegisterActions;

};