export enum FileType {
    File = 'File',

    Folder = 'Folder',
}

export enum FileStatus {
    Opened = 'Opened',

    Closed = 'Closed',
}

export interface File {
    id: number;

    type: string;

    name: string;

    content: string;

    likes: number;

    children: File[];

    parent: number | null;

    lastEditor: string;

    isLiked: boolean;

    author: {
        email: string
    };

    status?: string;

    isPending?: boolean;
}

export interface TempFile {
    id: number;

    name: string;

    type: FileType;

    parent: number | null;

    isPending: true;
}