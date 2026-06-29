import {useEffect} from "react";

interface Params {
    pendingPasteId: number | null;
    copiedFile: any;
    handlePasteFile: (id: number) => void;
    clearPendingPaste: () => void;
}

export function usePendingPasteEffect(
    {
        pendingPasteId,
        copiedFile,
        handlePasteFile,
        clearPendingPaste,
    }: Params) {

    useEffect(() => {
        if (
            pendingPasteId === null ||
            !copiedFile
        ) {
            return;
        }

        handlePasteFile(
            pendingPasteId
        );

        clearPendingPaste();
    }, [
        pendingPasteId,
        copiedFile,
        handlePasteFile,
        clearPendingPaste,
    ]);
}