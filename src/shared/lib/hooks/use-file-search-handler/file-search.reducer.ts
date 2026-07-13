import {SearchType} from "../../../../types/searchType";
import {FileSearchState, initialState} from "./file-search.types";

export type FileSearchAction =
    | {
    type: "SET_SEARCH_TYPE";
    payload: SearchType;
}
    | {
    type: "SWITCH_SEARCH_TYPE";
}
    | {
    type: "RESET";
};

export function fileSearchReducer(
    state: FileSearchState,
    action: FileSearchAction
): FileSearchState {
    switch (action.type) {
        case "SET_SEARCH_TYPE":
            return {
                ...state,
                searchType: action.payload,
            };

        case "SWITCH_SEARCH_TYPE":
            return {
                ...state,
                searchType:
                    state.searchType === SearchType.InFileNames
                        ? SearchType.InFileContents
                        : SearchType.InFileNames,
            };

        case "RESET":
            return {
                ...initialState,
            };

        default:
            return state;
    }
}