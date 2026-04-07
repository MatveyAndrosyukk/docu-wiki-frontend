import {UiFile} from "../../../store/types/UiFile";
import {FileType} from "../../../types/file";

export const compareNodes = (a: UiFile, b: UiFile) => {
    if (a.type !== b.type) {
        if (a.type === FileType.Folder) return -1;
        if (b.type === FileType.Folder) return 1;
    }

    return a.name.localeCompare(b.name);
};