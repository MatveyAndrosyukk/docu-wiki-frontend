import {FileType} from "../../../../../../../types/file";
import {UiFile} from "../../../../../../../store/types/UiFile";
import {countFilesRecursively} from "../../../../../utils/modalUtils";

export function getFilesCountToAdd(
    file: UiFile
): number {
    if (
        file.type === FileType.File
    ) {
        return 1;
    }

    return countFilesRecursively(
        file
    );
}