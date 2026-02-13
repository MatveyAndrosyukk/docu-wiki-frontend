import {ServerFile} from "../types/ServerFile";
import {UiFile} from "../types/UiFile";
import {FileStatus} from "../../types/file";

export function mapServerFileToUi(file: ServerFile): UiFile {
    return {
        id: file.id,
        name: file.name,
        type: file.type,
        parent: file.parent,
        author: file.author,

        content: file.content,
        likes: file.likes ?? 0,
        isLiked: file.isLiked ?? false,
        lastEditor: file.lastEditor,

        children: (file.children ?? []).map(mapServerFileToUi),

        status: FileStatus.Closed,
        isPending: false,
    };
}