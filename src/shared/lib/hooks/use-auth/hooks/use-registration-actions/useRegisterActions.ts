import {useCallback, useReducer} from "react";
import {registrationReducer} from "./registration.reducer";
import {performRegisterAsync} from "../../../../services/performRegisterAsync";
import {initialState, RegisterActionsState, RegisterModalValue} from "./registration.types";

export default function useRegisterActions(): RegisterActionsState {

    const [state, dispatch] = useReducer(
        registrationReducer,
        initialState
    );

    const setValue = useCallback(
        (value: Partial<RegisterModalValue>) => {
            dispatch(
                {
                    type: "SET_VALUE",
                    payload: value,
                }
            );
        },
        []
    );

    const setError = useCallback(
        (error: string | null) => {
            dispatch(
                {
                    type: "SET_ERROR",
                    payload: error,
                }
            );
        },
        []
    );

    const setMessage = useCallback(
        (
            message: string | null
        ) => {
            dispatch(
                {
                    type: "SET_MESSAGE",
                    payload: message,
                }
            );
        },
        []
    );

    const setIsModal = useCallback(
        (
            value: boolean
        ) => {
            dispatch(
                {
                    type: "SET_IS_MODAL",
                    payload: value,
                }
            );
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

    const register = useCallback(
        async () => {

            const email = state.value.email.trim();

            const username = state.value.username.trim();

            if (!email) {
                setError(
                    "Email is required"
                );

                return;
            }

            if (username.length < 4) {
                setError(
                    "Username must be at least 4 characters"
                );

                return;
            }

            dispatch(
                {
                    type: "SET_LOADING",
                    payload: true
                }
            );

            dispatch(
                {
                    type: "SET_ERROR",
                    payload: null
                }
            );

            try {
                await performRegisterAsync(
                    state.value.email,
                    state.value.password,
                    state.value.username,
                );

                dispatch(
                    {
                        type: "SET_LOADING",
                        payload: false
                    }
                );

                dispatch(
                    {
                        type: "SET_IS_MODAL",
                        payload: false
                    }
                );

                dispatch(
                    {
                        type: "SET_ERROR",
                        payload: null
                    }
                );

                dispatch(
                    {
                        type: "SET_MESSAGE",
                        payload: "Confirmation link sent"
                    }
                );

                dispatch(
                    {
                        type: "RESET"
                    }
                );

            } catch (error) {
                dispatch(
                    {
                        type: "SET_LOADING",
                        payload: false
                    }
                );

                if (error instanceof Error) {
                    setError(
                        error.message
                    );
                }
            }

        }, [
            setError,
            state.value.email,
            state.value.password,
            state.value.username
        ]
    );

    return {
        state,
        actions: {
            setValue,
            setError,
            setMessage,
            setIsModal,
            register,
            reset,
        },
    };
}