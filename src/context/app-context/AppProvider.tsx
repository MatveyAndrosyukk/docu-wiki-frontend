import {FC, ReactNode} from "react";
import useFilesActions, {FileActionsState} from "../../shared/lib/hooks/useFilesActions";
import useBanUserHandler from "../../shared/lib/hooks/use-ban-user-handler/useBanUserHandler";
import usePremiumModal, {PremiumState} from "../../shared/ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";
import {Context} from "./Context";
import useAuthHandler, {AuthState} from "../../shared/lib/hooks/use-auth/useAuthHandler";
import {BanUserActionsState} from "../../shared/lib/hooks/use-ban-user-handler/ban-user.types";

export interface ProviderState {
    fileState: FileActionsState;
    userBan: BanUserActionsState;
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
    const userBan = useBanUserHandler();
    const authState = useAuthHandler();

    return (
        <Context.Provider
            value={{
                fileState,
                userBan,
                premiumState,
                authState,
            }}>
            {children}
        </Context.Provider>
    );
};
