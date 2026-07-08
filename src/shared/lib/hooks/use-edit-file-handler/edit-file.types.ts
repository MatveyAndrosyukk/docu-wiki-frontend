export type EditFileState = {

    isEditing: boolean;

    isFileContentChanged: boolean;

    isTryToSwitchWhileEditing: boolean;

    switchedFileId: number | null;

    contentError: string;

};

export type EditFileActions = {

    setIsEditing(value: boolean): void;

    setIsFileContentChanged(value: boolean): void;

    setIsTryToSwitchWhileEditing(value: boolean): void;

    setSwitchedFileId(value: number | null): void;

    setContentError(value: string): void;

    reset(): void;

    tryToOpenFile(targetFileId: number): void;

    rejectSwitch(): void;

    confirmSwitch(): void;

    saveChanges(
        fileId: number,
        newContent: string,
        addedImages: string[],
        editorUsername?: string,
    ): void;

    cancelChanges(
        contentBeforeEdition: string,
        addedImages: string[],
    ): Promise<void>;

};

export type EditFileActionsState = {

    state: EditFileState;

    actions: EditFileActions;

};

export const initialState: EditFileState = {

    isEditing: false,

    isFileContentChanged: false,

    isTryToSwitchWhileEditing: false,

    switchedFileId: null,

    contentError: "",

};