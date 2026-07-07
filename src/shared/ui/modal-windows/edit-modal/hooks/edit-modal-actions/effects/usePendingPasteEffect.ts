import {useEffect} from "react";
import {UiFile} from "../../../../../../../store/types/UiFile";

interface Params {
    pendingPasteId: number | null;
    copiedFile: UiFile | null;
    paste: (id: number | null) => void;
    clearPendingPaste: () => void;
}

export function usePendingPasteEffect(
    {
        pendingPasteId,
        copiedFile,
        paste,
        clearPendingPaste,
    }: Params) {

    useEffect(() => {
        if (
            pendingPasteId === null ||
            !copiedFile
        ) {
            return;
        }

        paste(
            pendingPasteId
        );

        clearPendingPaste();
    }, [
        pendingPasteId,
        copiedFile,
        paste,
        clearPendingPaste,
    ]);
}