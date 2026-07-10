import {useCallback, useReducer, useRef} from "react";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../../../../store";
import {performLoginAsync} from "../../../../services/performLoginAsync";
import {jwtDecode} from "jwt-decode";
import {clearUiState} from "../../../../../../store/slices/fileUiSlice";
import {fetchLoggedInUserByEmail} from "../../../../../../store/thunks/user/fetchLoggedInUserByEmail";
import {clearServerFiles} from "../../../../../../store/slices/fileServerSlice";
import {clearLoggedInUser} from "../../../../../../store/slices/userSlice";
import {initialState, LoginActionsState, LoginModalValue} from "./login.types";
import {loginReducer} from "./login.reducer";
import {useAuthContext} from "../../../../../../context/auth-context/hooks/useAuthContext";

export default function useLoginHandler(): LoginActionsState {
    const inputRef = useRef<HTMLInputElement>(null);

    const [state, dispatch] = useReducer(
        loginReducer,
        {
            ...initialState,
            inputRef,
        }
    );

    const reduxDispatch = useDispatch<AppDispatch>();

    const {
        setAuthStatus
    } = useAuthContext();

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

    const reset = useCallback(
        () => {
            dispatch({
                type: "RESET",
            });
        },
        []
    );

    const setValue = useCallback(
        (
            value: Partial<LoginModalValue>
        ) => {
            dispatch({
                type: "SET_VALUE",
                payload: value,
            });
        },
        []
    );

    const setError = useCallback(
        (
            error: string | null
        ) => {
            dispatch({
                type: "SET_ERROR",
                payload: error,
            });
        },
        []
    );

    const setMessage = useCallback(
        (
            message: string | null
        ) => {
            dispatch({
                type: "SET_MESSAGE",
                payload: message,
            });
        },
        []
    );

    const logout = useCallback(
        () => {
            localStorage.clear();

            reduxDispatch(clearUiState());

            reduxDispatch(clearServerFiles());

            reduxDispatch(clearLoggedInUser());

            setAuthStatus("unauthenticated");
        },
        [
            reduxDispatch,
            setAuthStatus
        ]
    );

    const login = useCallback(
        async () => {
            const loginAsync = async () => {
                const data = await performLoginAsync(
                    state.value.login,
                    state.value.password
                );

                type JwtPayload = {
                    email: string;
                    roles: {
                        id: number;
                        value: string;
                        description: string;
                    }[];
                    iat: number;
                    exp: number;
                };

                const decoded: JwtPayload = jwtDecode(
                    data.accessToken
                );

                const roleValues = decoded.roles.map(
                    role => role.value
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

                await reduxDispatch(
                    fetchLoggedInUserByEmail(
                        decoded.email
                    )
                ).unwrap();

                setAuthStatus(
                    "authenticated"
                );
            };

            dispatch({
                type: "SET_LOADING",
                payload: true,
            });

            dispatch({
                type: "SET_ERROR",
                payload: null,
            });

            try {
                await loginAsync();
            } finally {
                dispatch({
                    type: "SET_LOADING",
                    payload: false,
                });
            }
        },
        [
            state.value.login,
            state.value.password,
            reduxDispatch,
            setAuthStatus
        ]
    );

    return {
        state,
        actions: {
            login,
            logout,
            openModal,
            closeModal,
            reset,
            setValue,
            setError,
            setMessage,
        },
    };
}