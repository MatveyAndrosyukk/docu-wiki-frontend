import {SearchType} from "../../../types/searchType";

export const useSelectPlaceholderText = (isNarrowScreen: boolean, searchType: SearchType) => {
    if (isNarrowScreen) {
        return searchType === SearchType.InFileNames
            ? "Files..."
            : "Text...";
    }

    return searchType === SearchType.InFileNames
        ? "Search for files..."
        : "Search for file content...";
};