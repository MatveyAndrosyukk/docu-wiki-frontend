import {RefObject} from "react";
import {UiFile} from "../../../../../../store/types/UiFile";

export type ContextMenuState = {

    visible: boolean;

    clickX: number;

    clickY: number;

    file: UiFile | null;

    copiedFile: UiFile | null;

    menuRef: RefObject<HTMLUListElement | null>;

};

export type ContextMenuActions = {

    open(
        event: MouseEvent | {
            clientX: number;
            clientY: number;
            preventDefault?: () => void;
        },
        file: UiFile
    ): void;

    close(): void;

    copy(
        file: UiFile
    ): void;

    setCopiedFile(
        file: UiFile | null
    ): void;

    paste(
        parentId: number | null
    ): void;

    addFile(
        parentId: number
    ): void;

    addRootFolder(): void;

    addFolder(
        parentId: number
    ): void;

    rename(
        file: UiFile
    ): void;

    remove(
        file: UiFile
    ): void;

};

export type ContextMenuHandlerState = {

    state: ContextMenuState;

    actions: ContextMenuActions;

};


export const initialState = {

    visible: false,

    clickX: 0,

    clickY: 0,

    file: null,

    copiedFile: null,

} as ContextMenuState;