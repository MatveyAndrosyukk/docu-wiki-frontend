import {ActionType} from "../utils/supporting-hooks/useModalActions";

export type NameConflictResult =
    | { hasConflict: false }
    | { hasConflict: true; reason: ActionType};