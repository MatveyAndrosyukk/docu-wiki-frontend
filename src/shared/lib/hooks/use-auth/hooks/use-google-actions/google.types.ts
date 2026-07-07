import {CodeResponse} from "@react-oauth/google";

export type GoogleState = {
    loading: boolean;

    error: string | null;
};

export const initialState: GoogleState = {
    loading: false,
    error: null,
};

export type GoogleActions = {
    setLoading(value: boolean): void;

    setError(value: string | null): void;

    reset(): void;

    success(
        codeResponse: CodeResponse
    ): Promise<void>;

    error(): void;
};

export type GoogleActionsState = {
    state: GoogleState;

    actions: GoogleActions;
};