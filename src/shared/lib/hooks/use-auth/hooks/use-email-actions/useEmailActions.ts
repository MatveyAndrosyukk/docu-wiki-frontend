import {ChangeEvent, useCallback, useReducer, useRef} from "react";
import {sendResetPasswordLinkAsync} from "../../../../services/sendResetPasswordLinkAsync";
import {EmailActionsState, initialState} from "./email.types";
import {emailReducer} from "./email.reducer";

export default function useEmailActions(): EmailActionsState {
    const inputRef = useRef<HTMLInputElement>(null);

    const [state, dispatch] = useReducer(
        emailReducer,
        {
            ...initialState,
            inputRef,
        }
    );

    const setError = useCallback(
        (error: string) => {
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
        (message: string) => {
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
        (value: boolean) => {
            dispatch(
                {
                    type: "SET_IS_MODAL",
                    payload: value,
                }
            );
        },
        []
    );

    const setLoading = useCallback(
        (loading: boolean) => {
            dispatch(
                {
                    type: "SET_LOADING",
                    payload: loading,
                }
            );
        },
        []
    );

    const setValue = useCallback(
        (value: string) => {
            dispatch(
                {
                    type: "SET_VALUE",
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

    const sendChangePasswordLink = useCallback(
        async () => {
            setError('');

            setMessage('');

            const email = state.value.trim();

            if (!email) {

                setError(
                    'Email address is required'
                );

                return;
            }

            setLoading(true);

            try {

                await sendResetPasswordLinkAsync(
                    email
                ).then(
                    () => {
                        setError('');

                        setMessage(
                            'Reset link sent to your email.'
                        );

                        setValue('');

                    }
                ).catch(
                    (
                        error
                    ) => {

                        setMessage('')

                        setError(
                            error.message
                        );
                    }
                )
            } finally {

                setLoading(false);

            }

        },
        [
            setError,
            setLoading,
            setMessage,
            setValue,
            state.value
        ]
    )

    const handleChangeEmail = useCallback(
        (
            e: ChangeEvent<HTMLInputElement>
        ) => {

            setValue(
                e.target.value
            );

        },
        [
            setValue
        ]
    );

    return {
        state,
        actions: {
            setValue,
            setError,
            setLoading,
            setMessage,
            setIsModal,
            sendChangePasswordLink,
            handleChangeEmail,
            reset,
        },
    }
}