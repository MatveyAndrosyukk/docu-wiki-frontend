import {SearchType} from "../../../../types/searchType";

export type FileSearchState = {
    searchType: SearchType;
};

export type FileSearchActions = {
    setSearchType(value: SearchType): void;
    switchSearchType(): void;
    openPathToSelectedFile(id: number): void;
};

export type FileSearchActionsState = {
    state: FileSearchState;
    actions: FileSearchActions;
};

export const initialState: FileSearchState = {
    searchType: SearchType.InFileNames,
};