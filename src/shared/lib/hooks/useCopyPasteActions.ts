import {useCallback, useState} from "react";
import {UiFile} from "../../../store/types/UiFile";
import {ActionType, ModalOpenState} from "./useModalActions";

export interface CopyPasteState {
    copiedFile: UiFile | null;
    setCopiedFile: (file: UiFile | null) => void;
    handleCopyFile: (file: UiFile) => void;
    handlePasteFile: (id: number | null) => void;
}

export default function useCopyPasteActions(
    openModalByReason: (modalState: ModalOpenState) => void
): CopyPasteState {

    const [copiedFile, setCopiedFile] = useState<UiFile | null>(null);

    const handleCopyFile = useCallback((file: UiFile) => {
        setCopiedFile(file);
    }, []);

    const handlePasteFile = useCallback(
        (id: number | null) => {
            if (!copiedFile) return;

            openModalByReason({
                reason: ActionType.PasteFile,
                id,
                title: "Paste file",
                defaultValue: copiedFile.name,
            });
        },
        [copiedFile, openModalByReason]
    );

    return {
        copiedFile,
        setCopiedFile,
        handleCopyFile,
        handlePasteFile,
    };
}