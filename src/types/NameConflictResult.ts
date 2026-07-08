import {ActionType} from "../shared/lib/hooks/use-file-actions-modal-handler/types/ActionType";


export type NameConflictResult =
    | { hasConflict: false }
    | { hasConflict: true; reason: ActionType};