import {ActionType} from "../shared/lib/hooks/useModalActions";

export type NameConflictResult =
    | { hasConflict: false }
    | { hasConflict: true; reason: ActionType};