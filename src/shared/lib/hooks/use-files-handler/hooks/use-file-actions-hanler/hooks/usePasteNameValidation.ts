import {useEffect} from "react";
import {checkNameConflictInFolder} from "../../../../../utils/modalUtils";
import {FileType} from "../../../../../../../types/file";
import {UiFile} from "../../../../../../../store/types/UiFile";
import {ActionModalState, ActionType} from "../file-actions-handler.types";

interface Params {
    modalValue: string;
    modalOpenState: ActionModalState;
    files: UiFile[];
    copiedFile: UiFile | null;
    setModalError: (value: string) => void;
}

export function usePasteNameValidation(
    {
        modalValue,
        modalOpenState,
        files,
        copiedFile,
        setModalError,
    }: Params) {

    useEffect(() => {
        if (
            modalOpenState.reason !== ActionType.PasteFile
        ) {
            return;
        }

        if (
            modalOpenState.id == null ||
            !copiedFile
        ) {
            return;
        }

        const trimmedTitle =
            modalValue.trim();

        if (!trimmedTitle) {
            setModalError('');
            return;
        }

        const hasConflict =
            checkNameConflictInFolder(
                files,
                modalOpenState.id,
                trimmedTitle
            );

        if (!hasConflict) {
            setModalError('');
            return;
        }

        const typeLabel =
            copiedFile.type === FileType.File
                ? 'File'
                : 'Folder';

        setModalError(
            `${typeLabel} with this name exists`
        );

    }, [
        modalValue,
        modalOpenState,
        files,
        copiedFile,
        setModalError,
    ]);
}