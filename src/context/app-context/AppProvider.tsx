import {FC, ReactNode} from "react";
import useFilesHandler from "../../shared/lib/hooks/use-files-handler/useFilesHandler";
import useBanUserHandler from "../../shared/lib/hooks/use-ban-user-handler/useBanUserHandler";
import usePremiumModal, {PremiumState} from "../../shared/ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";
import {Context} from "./Context";
import useAuthHandler, {AuthState} from "../../shared/lib/hooks/use-auth-handler/useAuthHandler";
import {BanUserActionsState} from "../../shared/lib/hooks/use-ban-user-handler/ban-user.types";
import useEditorHandler from "../../shared/lib/hooks/use-editor-handler/useEditorHandler";
import {EditorState} from "../../shared/lib/hooks/use-editor-handler/editor.types";
import {FilesState} from "../../shared/lib/hooks/use-files-handler/files.types";

export interface ProviderState {
    filesHandler: FilesState;
    banHandler: BanUserActionsState;
    premiumHandler: PremiumState;
    authHandler: AuthState;
    editorHandler: EditorState;
}

export interface Params {
    children: ReactNode;
}

export const AppProvider: FC<Params> = (
    {
        children
    }
) => {
    const premiumHandler = usePremiumModal();
    const filesHandler = useFilesHandler(premiumHandler);
    const banHandler = useBanUserHandler();
    const authHandler = useAuthHandler();
    const editorHandler = useEditorHandler();

    return (
        <Context.Provider
            value={{
                filesHandler,
                banHandler,
                premiumHandler,
                authHandler,
                editorHandler,
            }}>
            {children}
        </Context.Provider>
    );
};
