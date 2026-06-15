import {FileStatus, FileType} from "../../types/file";

export interface UiFile {
    id: number;
    name: string;
    type: FileType;
    parent: number | null;
    author?: { email: string };
    children: UiFile[];
    content?: string;
    likes?: number;
    isLiked?: boolean;
    lastEditor?: string;
    status: FileStatus;
    isPending: boolean;
    createdAt?: string;
    updatedAt?: string;
}