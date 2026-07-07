import {ReactNode, useState} from "react";
import {AuthContext} from "./AuthContext";

export type AuthStatus =
    | "loading"
    | "authenticated"
    | "unauthenticated";

export function AuthProvider({children}: { children: ReactNode }) {

    const [authStatus, setAuthStatus] = useState<AuthStatus>(
        "loading"
    );

    return (
        <AuthContext.Provider
            value={
                {
                    authStatus,
                    setAuthStatus,
                }
            }
        >
            {children}
        </AuthContext.Provider>
    )
}