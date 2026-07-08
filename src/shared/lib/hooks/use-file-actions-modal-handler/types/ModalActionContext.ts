import {AppDispatch} from "../../../../../store";
import {UiFile} from "../../../../../store/types/UiFile";
import {PremiumState} from "../../../../ui/modal-windows/premium-modal/utils/hooks/usePremiumModal";
import {User} from "../../../../../store/slices/userSlice";

export interface ModalActionContext {
    files: UiFile[];
    dispatch: AppDispatch;
    viewedUserEmail: string;
    loggedInUser: User | null;
    totalFiles: number;
    filesLimit: number;
    premiumState: PremiumState;
    closeModal: () => void;
    setModalError: (value: string) => void;
    loggedInUserEmail: string | null;
}