import {createContext, ReactNode, useState} from "react";

type AuthStatus =
    | "loading"
    | "authenticated"
    | "unauthenticated";

type AuthContextType = {
    authStatus: AuthStatus;
    setAuthStatus: (authStatus: AuthStatus) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [authStatus, setAuthStatus] = useState<AuthStatus>('loading');

    return (
        <AuthContext.Provider value={{ authStatus, setAuthStatus }}>
            {children}
        </AuthContext.Provider>
    )
}