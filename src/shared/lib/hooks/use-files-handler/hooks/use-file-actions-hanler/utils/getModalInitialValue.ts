import {findFileById} from "../../../../../../../store/utils/file.utils";
import {UiFile} from "../../../../../../../store/types/UiFile";
import {ActionModalState, ActionType} from "../file-actions-handler.types";

export function getModalInitialValue(
    files: UiFile[],
    modalState: ActionModalState
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