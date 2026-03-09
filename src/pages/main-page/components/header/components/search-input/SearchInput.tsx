import React, {useEffect, useRef, useState} from 'react';
import searchFilesByName, {SearchResult} from "../../../../../../utils/functions/searchFilesByName";
import styles from './SearchInput.module.scss'
import {FileType} from "../../../../../../types/file";
import {SearchType} from "../../../../../../types/searchType";
import searchFilesByContent from "../../../../../../utils/functions/searchFilesByContent";
import {selectFileTree} from "../../../../../../store/selectors/selectFileTree";
import {useSelector} from "react-redux";
import { ReactComponent as FileIcon } from './images/search-input-file.svg'
import { ReactComponent as FolderIcon } from './images/search-input-folder.svg'

interface SearchProps {
    onClick: (id: number) => void;
    searchType: SearchType;
}

const SearchInput: React.FC<SearchProps> = ({onClick, searchType}) => {
    const files = useSelector(selectFileTree);
    const [query, setQuery] = useState('');
    const [isInputFocused, setIsInputFocused] = useState(false);
    const searchInputBlockRef = useRef<HTMLDivElement>(null);
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isNarrowScreen, setIsNarrowScreen] = useState(window.innerWidth < 457);

    useEffect(() => {
        function handleResize() {
            setIsNarrowScreen(window.innerWidth < 457);
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (query.trim() === '') {
            setResults([]);
            return;
        }
        let found;
        if (searchType === SearchType.InFileNames) {
            found = searchFilesByName(files, query.trim());
        } else {
            found = searchFilesByContent(files, query.trim());
        }
        setResults(found);
    }, [query, files, searchType]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                searchInputBlockRef.current &&
                !searchInputBlockRef.current.contains(event.target as Node)
            ) {
                setIsInputFocused(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const placeholderText = isNarrowScreen
        ? (searchType === SearchType.InFileNames
            ? "Files..."
            : "Text...")
        : (searchType === SearchType.InFileNames
            ? "Search for files..."
            : "Search for file content...");

    return (
        <div className={styles["search-input"]} ref={searchInputBlockRef}>
            <input
                type="text"
                placeholder={placeholderText}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                className={styles["search-input__field"]}
            />
            {(isInputFocused && results.length > 0) && (
                <ul className={styles["search-input__list"]}>
                    {results.map(({id, type, fullPath, content}) => {
                        const Icon = type === FileType.Folder ? FolderIcon : FileIcon;

                        return (<li
                            key={id}
                            title={fullPath}
                            onClick={() => onClick(id)}
                            className={styles["search-input__item"]}
                        >
                            <Icon className={styles["search-input__icon"]} />

                            <span
                                className={styles["search-input__text"]}
                                title={searchType === SearchType.InFileContents ? fullPath : undefined}
                            >
    {searchType === SearchType.InFileNames ? fullPath : content}
  </span>
                        </li>)
                    })}
                </ul>
            )}
        </div>
    );
};

export default SearchInput;