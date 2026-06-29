import {findFileById} from "../../../../../store/utils/fileTreeActionUtils";
import {UiFile} from "../../../../../store/types/UiFile";
import {OpenModalState} from "../types/OpenModalState";
import {ActionType} from "../types/ActionType";

export function getModalInitialValue(
    files: UiFile[],
    modalState: OpenModalState
): string {

    if (
        modalState.reason === ActionType.RenameFile &&
        modalState.id
    ) {
        const node = findFileById(
            files,
            modalState.id
        );

        return node?.name || '';
    }

    if (modalState.defaultValue) {
        return modalState.defaultValue;
    }

    return '';
}