import {ChangeEvent, useCallback, useReducer, useRef} from "react";
import {resetPasswordAsync} from "../../../../services/resetPasswordAsync";
import {LoginActionsState} from "../use-login-actions/login.types";
import {RegisterActionsState} from "../use-registration-actions/registration.types";
import {initialState, ResetActionsState, ResetValue} from "./reset.types";
import {resetReducer} from "./reset.reducer";

export default function useResetActions(
    login: LoginActionsState,
    registration: RegisterActionsState,
): ResetActionsState {

    const newPasswordInputRef = useRef<HTMLInputElement>(null);

    const [state, dispatch] = useReducer(
        resetReducer,
        {
            ...initialState,
            newPasswordInputRef,
        }
    );

    const openModal = useCallback(
        () => {
            dispatch({
                type: "OPEN_MODAL",
            });
        },
        []
    );

    const closeModal = useCallback(
        () => {
            dispatch({
                type: "CLOSE_MODAL",
            });
        },
        []
    );

    const setLoading = useCallback(
        (value: boolean) => {
            dispatch({
                type: "SET_LOADING",
                payload: value,
            });
        },
        []
    );

    const setError = useCallback(
        (value: string) => {
            dispatch({
                type: "SET_ERROR",
                payload: value,
            });
        },
        []
    );

    const setMessage = useCallback(
        (value: string) => {
            dispatch({
                type: "SET_MESSAGE",
                payload: value,
            });
        },
        []
    );

    const setValue = useCallback(
        (
            value: Partial<ResetValue>
        ) => {
            dispatch({
                type: "SET_VALUE",
                payload: value,
            });
        },
        []
    );

    const setIsModal = useCallback(
        (value: boolean) => {
            dispatch({
                type: "SET_IS_MODAL",
                payload: value,
            });
        },
        []
    );

    const reset = useCallback(
        () => {
            dispatch({
                type: "RESET",
            });
        },
        []
    );

    const handleChangeNewPassword = useCallback(
        (
            e: ChangeEvent<HTMLInputElement>
        ) => {
            setValue({
                newPassword: e.target.value,
            });
        },
        [
            setValue
        ]
    );

    const handleChangeRepeatPassword = useCallback(
        (
            e: ChangeEvent<HTMLInputElement>
        ) => {
            setValue({
                repeatPassword: e.target.value,
            });
        },
        [
            setValue
        ]
    );

    const blurNewPassword = useCallback(
        () => {

            const pwd = state.value.newPassword;

            if (
                !pwd ||
                pwd.length < 6
            ) {

                setError(
                    "Password is too short"
                );

            } else {

                setError("");

            }

        },
        [
            state.value.newPassword,
            setError
        ]
    );

    const blurRepeatPassword = useCallback(
        () => {

            if (
                state.value.repeatPassword !==
                state.value.newPassword
            ) {

                setError(
                    "Passwords do not match"
                );

            } else {

                setError("");

            }

        },
        [
            state.value.repeatPassword,
            state.value.newPassword,
            setError
        ]
    );

    const changePassword = useCallback(
        async (
            resetToken: string | undefined
        ) => {

            const newPassword =
                state.value.newPassword.trim();

            const repeatPassword =
                state.value.repeatPassword.trim();

            if (newPassword.length < 6) {

                setError(
                    "Password is too short"
                );

                return;

            }

            if (
                newPassword !==
                repeatPassword
            ) {

                setError(
                    "Passwords do not match"
                );

                return;

            }

            setLoading(true);

            setError("");

            if (!resetToken) {

                setError(
                    "Reset link not found"
                );

                setLoading(false);

                return;

            }

            try {

                await resetPasswordAsync(
                    resetToken,
                    newPassword
                );

                setError("");

                setMessage(
                    "Password was reset successfully"
                );

            } catch {

                setMessage("");

                setError(
                    "Invalid link, please try again"
                );

            } finally {

                setLoading(false);

            }

        },
        [
            state.value.newPassword,
            state.value.repeatPassword,
            setLoading,
            setError,
            setMessage,
        ]
    );

    const resetPassword = useCallback(
        async (resetToken: string | undefined
        ) => {
            try {

                const loginModalInitialValue = {
                    login: '',
                    password: ''
                };

                await changePassword(
                    resetToken
                );

                login.actions.setValue(loginModalInitialValue)

                login.actions.setError(null);

                login.actions.setMessage(
                    'Password was reset successfully'
                );

                closeModal();

                registration.actions.setIsModal(false);

                login.actions.openModal();

            } catch (error) {

                console.error(
                    'Password reset error:',
                    error,
                );

            }
        },
        [
            changePassword,
            login.actions,
            closeModal,
            registration.actions
        ]
    );

    return {
        state,
        actions: {
            openModal,
            closeModal,
            setLoading,
            setError,
            setMessage,
            setValue,
            setIsModal,
            handleChangeNewPassword,
            handleChangeRepeatPassword,
            blurNewPassword,
            blurRepeatPassword,
            resetPassword,
            reset,
        },
    };
}