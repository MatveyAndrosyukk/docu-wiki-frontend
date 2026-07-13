import {ChangeEvent, useCallback, useReducer, useRef} from "react";
import {resetPasswordAsync} from "../../../../services/resetPasswordAsync";
import {LoginActionsState} from "../use-login-handler/login.types";
import {RegisterActionsState} from "../use-registration-handler/registration.types";
import {initialState, ResetPasswordActionsState, ResetPasswordValue} from "./reset-password.types";
import {resetPasswordReducer} from "./reset-password.reducer";

interface Props {
    loginHandler: LoginActionsState,
    registrationHandler: RegisterActionsState,
}

export default function useResetPasswordHandler(
    {
        loginHandler,
        registrationHandler
    }: Props
): ResetPasswordActionsState {

    const newPasswordInputRef = useRef<HTMLInputElement>(null);

    const [state, dispatch] = useReducer(
        resetPasswordReducer,
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
            value: Partial<ResetPasswordValue>
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

                loginHandler.actions.setValue(loginModalInitialValue)

                loginHandler.actions.setError(null);

                loginHandler.actions.setMessage(
                    'Password was reset successfully'
                );

                closeModal();

                registrationHandler.actions.setIsModal(false);

                loginHandler.actions.openModal();

            } catch (error) {

                console.error(
                    'Password reset error:',
                    error,
                );

            }
        },
        [
            changePassword,
            loginHandler.actions,
            closeModal,
            registrationHandler.actions
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