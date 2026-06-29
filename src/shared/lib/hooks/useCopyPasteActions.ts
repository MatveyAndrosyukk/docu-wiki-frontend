import {useCallback, useState} from "react";
import {UiFile} from "../../../store/types/UiFile";
import {OpenModalState} from "./modal-actions/types/OpenModalState";
import {ActionType} from "./modal-actions/types/ActionType";

export interface CopyPasteState {
    copiedFile: UiFile | null;
    setCopiedFile: (file: UiFile | null) => void;
    handleCopyFile: (file: UiFile) => void;
    handlePasteFile: (id: number | null) => void;
}

export default function useCopyPasteActions(
    openModal: (modalState: OpenModalState) => void
): CopyPasteState {
    const [copiedFile, setCopiedFile] = useState<UiFile | null>(null);

    const handleCopyFile = useCallback((file: UiFile) => {
        setCopiedFile(file);
    }, []);

    const handlePasteFile = useCallback(
        (id: number | null) => {
            if (!copiedFile) return;

            openModal({
                reason: ActionType.PasteFile,
                id,
                title: "Paste file",
                defaultValue: copiedFile.name,
            });
        },
        [copiedFile, openModal]
    );

    return {
        copiedFile,
        setCopiedFile,
        handleCopyFile,
        handlePasteFile,
    };
}