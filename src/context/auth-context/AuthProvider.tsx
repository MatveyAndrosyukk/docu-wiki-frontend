import {ReactNode, useState} from "react";
import {AuthContext} from "./AuthContext";

export interface Props {
    children: ReactNode
}

export type AuthStatus =
    | "loading"
    | "authenticated"
    | "unauthenticated";

export function AuthProvider(
    {
        children
    }: Props
) {

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