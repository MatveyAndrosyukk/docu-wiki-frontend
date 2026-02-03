export enum FileType {
    File = 'File',
    Folder = 'Folder',
}

export enum FileStatus {
    Opened = 'Opened',
    Closed = 'Closed',
}

export interface File {
    id: number | null;
    author: string | null;
    type: string;
    name: string;
    content: string;
    status: string | null;
    likes: number | null;
    children: File[] | null;
    parent: number | { id: number } | null;
    lastEditor: string | null;
    isLiked: boolean | null;
    isPending?: boolean | null;
}

export interface TempFile {
    id: number;
    name: string;
    type: FileType;
    parent: number | null;
    isPending: true;
}