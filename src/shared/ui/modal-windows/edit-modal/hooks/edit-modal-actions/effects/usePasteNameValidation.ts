import {useEffect} from "react";
import {checkNameConflictInFolder} from "../../../../../../lib/utils/modalUtils";
import {FileType} from "../../../../../../../types/file";
import {UiFile} from "../../../../../../../store/types/UiFile";
import {OpenModalState} from "../types/OpenModalState";
import {ActionType} from "../types/ActionType";

interface Params {
    modalValue: string;
    modalOpenState: OpenModalState;
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