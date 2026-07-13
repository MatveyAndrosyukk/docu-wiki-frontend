import {useEffect, useState} from "react";
import {SearchType} from "../../../types/searchType";
import searchFilesByName, {SearchResult} from "../utils/searchFilesByName";
import searchFilesByContent from "../utils/searchFilesByContent";
import {UiFile} from "../../../store/types/UiFile";

interface Props {
    query: string,

    files: UiFile[],

    searchType: SearchType
}

export const useFileSearch = (
    {
        query,
        files,
        searchType,
    }: Props
) => {

    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(
        () => {

            const trimmed = query.trim();

            if (!trimmed) {

                setResults([]);

                return;
            }

            const found =
                searchType === SearchType.InFileNames
                    ? searchFilesByName(
                        files,
                        trimmed
                    )
                    : searchFilesByContent(
                        files,
                        trimmed
                    );

            setResults(found);
        },
        [
            query,
            files,
            searchType
        ]
    );

    return results;
};