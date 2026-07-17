import {createContext} from "react";
import {AuthStatus} from "./AuthProvider";

type AuthProviderState = {
    authStatus: AuthStatus;

    setAuthStatus: (
        authStatus: AuthStatus
    ) => void;
}

export const AuthContext = createContext<
    AuthProviderState | null
>(null);