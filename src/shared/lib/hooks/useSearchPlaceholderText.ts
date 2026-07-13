import {SearchType} from "../../../types/searchType";

interface Props {
    isNarrowScreen: boolean;
    searchType: SearchType;
}

export const useSearchPlaceholderText = (
    {
        isNarrowScreen,
        searchType
    }: Props
) => {
    if (isNarrowScreen) {
        return searchType === SearchType.InFileNames
            ? "Files..."
            : "Text...";
    }

    return searchType === SearchType.InFileNames
        ? "Search for files..."
        : "Search for file content...";
};