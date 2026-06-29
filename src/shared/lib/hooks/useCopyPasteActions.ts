import {useCallback, useState} from "react";
import {UiFile} from "../../../store/types/UiFile";

export interface CopyPasteState {
    copiedFile: UiFile | null;
    setCopiedFile: (file: UiFile | null) => void;
    handleCopyFile: (file: UiFile) => void;
}

export interface CopyPasteActions extends CopyPasteState {
    handlePasteFile: (id: number | null) => void;
}

export default function useCopyPasteActions(): CopyPasteState {
    const [copiedFile, setCopiedFile] = useState<UiFile | null>(null);

    const handleCopyFile = useCallback((file: UiFile) => {
        setCopiedFile(file);
    }, []);

    return {
        copiedFile,
        setCopiedFile,
        handleCopyFile,
    };
}