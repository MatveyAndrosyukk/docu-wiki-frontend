import {FileType} from "../../types/file";

export interface CreateFileDto {
    author: string;
    type: FileType;
    name: string;
    likes?: number | null;
    content?: string | null;
    parent?: number | null;
    children?: CreateFileDto[];
}