import {ActionType} from "../shared/ui/modal-windows/edit-modal/hooks/edit-modal-actions/types/ActionType";


export type NameConflictResult =
    | { hasConflict: false }
    | { hasConflict: true; reason: ActionType};