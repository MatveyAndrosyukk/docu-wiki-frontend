import {createContext, FC, ReactNode} from "react";
import useAuthActions, {AuthorizationState} from "../shared/lib/hooks/useAuthActions";
import useFilesActions, {FileActionsState} from "../shared/lib/hooks/useFilesActions";
import useEditorBan, {BanState} from "../shared/lib/hooks/useEditorBan";

export interface AppProviderState {
    authState: AuthorizationState;
    fileState: FileActionsState;
    banState: BanState;
}

export interface AppProviderProps {
    children: ReactNode;
}

export const AppContext = createContext<AppProviderState | null>(null);

export const AppProvider: FC<AppProviderProps> = ({children}) => {
    const authState = useAuthActions();
    const fileState = useFilesActions();
    const banState = useEditorBan();

    return (
        <AppContext.Provider value={{authState, fileState, banState}}>
            {children}
        </AppContext.Provider>
    );
};
