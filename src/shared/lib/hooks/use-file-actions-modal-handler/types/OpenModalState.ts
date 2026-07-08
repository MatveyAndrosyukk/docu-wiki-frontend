import {ActionType} from "./ActionType";

export interface OpenModalState {
    reason: ActionType | null;
    id: number | null;
    title: string | null;
    defaultValue?: string;
}