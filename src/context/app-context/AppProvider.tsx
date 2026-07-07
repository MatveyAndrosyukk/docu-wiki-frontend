import {FC, ReactNode} from "react";
import useFilesActions, {FileActionsState} from "../../shared/lib/hooks/useFilesActions";
import useEditorBan, {BanState} from "../../shared/lib/hooks/useEditorBan";
import usePremiumModal, {PremiumState} from "../../shared/ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";
import {Context} from "./Context";
import useAuth, {AuthState} from "../../shared/lib/hooks/use-auth/useAuth";

export interface ProviderState {
    fileState: FileActionsState;
    banState: BanState;
    premiumState: PremiumState;
    authState: AuthState;
}

export interface Params {
    children: ReactNode;
}

export const AppProvider: FC<Params> = (
    {
        children
    }
) => {
    const premiumState = usePremiumModal();
    const fileState = useFilesActions(premiumState);
    const banState = useEditorBan();
    const authState = useAuth();

    return (
        <Context.Provider
            value={{
                fileState,
                banState,
                premiumState,
                authState,
            }}>
            {children}
        </Context.Provider>
    );
};
