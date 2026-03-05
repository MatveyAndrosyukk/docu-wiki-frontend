import {FileType} from "./file";

export interface CreateFilePayload {
    name: string;
    type: FileType;
    parent: number | null;
    content?: string;
    tempId?: number;
    targetUserEmail: string;
}