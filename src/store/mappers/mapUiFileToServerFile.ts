import { UiFile } from "../types/UiFile";
import { ServerFile } from "../types/ServerFile";


export function mapUiFileToServerFile(file: UiFile): ServerFile {
    return {
        id: file.id,
        name: file.name,
        type: file.type,
        parent: file.parent,
        author: file.author ?? { email: '' },
        content: file.content,
        likes: file.likes ?? 0,
        isLiked: file.isLiked ?? false,
        lastEditor: file.lastEditor,
        children: file.children.length > 0
            ? file.children.map(mapUiFileToServerFile)
            : undefined,
    };
}