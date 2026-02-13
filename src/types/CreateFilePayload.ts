import {FileType} from "./file";

export interface CreateFilePayload {
    name: string;
    type: FileType;
    parent: number | null;
    author: string;
    content?: string;
    tempId?: number;
}