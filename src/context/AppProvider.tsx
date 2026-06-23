import {createContext, FC, ReactNode} from "react";
import useAuthActions, {AuthorizationState} from "../shared/lib/hooks/useAuthActions";
import useFilesActions, {FileActionsState} from "../shared/lib/hooks/useFilesActions";
import useEditorBan, {BanState} from "../shared/lib/hooks/useEditorBan";
import usePremiumModal, {PremiumState} from "../shared/ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";

export interface AppProviderState {
    authState: AuthorizationState;
    fileState: FileActionsState;
    banState: BanState;
    premiumState: PremiumState;
}

export interface AppProviderProps {
    children: ReactNode;
}

export const AppContext = createContext<AppProviderState | null>(null);

export const AppProvider: FC<AppProviderProps> = ({children}) => {
    const premiumState = usePremiumModal();
    const authState = useAuthActions();
    const fileState = useFilesActions(premiumState);
    const banState = useEditorBan();

    return (
        <AppContext.Provider
            value={{
                authState,
                fileState,
                banState,
                premiumState,
        }}>
            {children}
        </AppContext.Provider>
    );
};
