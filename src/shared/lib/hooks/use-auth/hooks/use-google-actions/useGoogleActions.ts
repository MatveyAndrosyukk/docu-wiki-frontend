import {useCallback, useReducer} from "react";
import {CodeResponse} from "@react-oauth/google";
import {AppDispatch} from "../../../../../../store";
import {performGoogleLoginAsync} from "../../../../services/performGoogleLoginAsync";
import {CustomJwtPayload} from "../../../../../../types/customJWTPayload";
import {jwtDecode} from "jwt-decode";
import {fetchLoggedInUserByEmail} from "../../../../../../store/thunks/user/fetchLoggedInUserByEmail";
import {useDispatch} from "react-redux";
import {GoogleActionsState, initialState} from "./google.types";
import {googleReducer} from "./google.reducer";
import {useAuthContext} from "../../../../../../context/auth-context/hooks/useAuthContext";

type Props = {
    closeLoginModal(): void;
};

export default function useGoogleActions(
    {
        closeLoginModal,
    }: Props): GoogleActionsState {
    const {setAuthStatus} = useAuthContext();

    const reduxDispatch = useDispatch<AppDispatch>();

    const [state, dispatch] = useReducer(
        googleReducer,
        initialState
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
        (value: string | null) => {
            dispatch({
                type: "SET_ERROR",
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

    const success = useCallback(
        async (
            codeResponse: CodeResponse
        ) => {

            setLoading(true);

            setError(null);

            try {

                const authorizationCode =
                    codeResponse.code;

                const data =
                    await performGoogleLoginAsync(
                        authorizationCode
                    );

                const decoded: CustomJwtPayload =
                    jwtDecode(data.accessToken);

                const roleValues =
                    decoded.roles.map(
                        (role: any) => role.value
                    );

                localStorage.setItem(
                    "accessToken",
                    data.accessToken
                );

                localStorage.setItem(
                    "refreshToken",
                    data.refreshToken
                );

                localStorage.setItem(
                    "email",
                    decoded.email
                );

                localStorage.setItem(
                    "roles",
                    JSON.stringify(roleValues)
                );

                reduxDispatch(
                    fetchLoggedInUserByEmail(
                        decoded.email
                    )
                );

                setAuthStatus(
                    "authenticated"
                );

                closeLoginModal();

            } catch (error) {

                if (error instanceof Error) {

                    setError(
                        error.message
                    );

                }

                console.error(
                    "Google login error",
                    error
                );

            } finally {

                setLoading(false);

            }

        },
        [
            setLoading,
            setError,
            reduxDispatch,
            setAuthStatus,
            closeLoginModal
        ]
    );

    const error = useCallback(
        () => {
            console.error(
                "Google Login Failed"
            );
        },
        []
    );

    return {
        state,
        actions: {
            setLoading,
            setError,
            reset,
            success,
            error,
        },
    };
}