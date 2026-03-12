import {useEffect, useState} from "react";
import {SearchType} from "../../types/searchType";
import searchFilesByName, {SearchResult} from "../functions/searchFilesByName";
import searchFilesByContent from "../functions/searchFilesByContent";
import {UiFile} from "../../store/types/UiFile";

export const useFileSearch = (query: string, files: UiFile[], searchType: SearchType) => {
    const [results, setResults] = useState<SearchResult[]>([]);

    useEffect(() => {
        const trimmed = query.trim();

        if (!trimmed) {
            setResults([]);
            return;
        }

        const found =
            searchType === SearchType.InFileNames
                ? searchFilesByName(files, trimmed)
                : searchFilesByContent(files, trimmed);

        setResults(found);
    }, [query, files, searchType]);

    return results;
};