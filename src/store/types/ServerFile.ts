import {FileType} from "../../types/file";

export interface ServerFile{
    id: number;

    name: string;

    type: FileType;

    parent: number | null;

    author: {
        email: string
    }

    content?: string;

    children?: ServerFile[];

    likes?: number;

    isLiked?: boolean;

    lastEditor?: string;

    updatedAt?: string,

    createdAt?: string,
}