import {ActionType} from "../shared/lib/hooks/modal-actions/types/ActionType";


export type NameConflictResult =
    | { hasConflict: false }
    | { hasConflict: true; reason: ActionType};