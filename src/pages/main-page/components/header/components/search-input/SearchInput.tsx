import React, {useRef, useState} from 'react';
import styles from './SearchInput.module.scss'
import {FileType} from "../../../../../../types/file";
import {SearchType} from "../../../../../../types/searchType";
import {selectFileTree} from "../../../../../../store/selectors/selectFileTree";
import {useSelector} from "react-redux";
import {ReactComponent as FileIcon} from './images/search-input-file.svg'
import {ReactComponent as FolderIcon} from './images/search-input-folder.svg'
import {useWindowWidth} from "../../../../../../shared/lib/hooks/useWindowWidth";
import {useFileSearch} from "../../../../../../shared/lib/hooks/useFileSearch";
import {useElementOutsideEvent} from "../../../../../../shared/lib/hooks/useElementOutsideEvent";
import {useSearchPlaceholderText} from "../../../../../../shared/lib/hooks/useSearchPlaceholderText";

interface SearchProps {
    onClick: (
        id: number
    ) => void;
    searchType: SearchType;
}

const SearchInput: React.FC<SearchProps> = ({onClick, searchType}) => {
    const [query, setQuery] =
        useState('');

    const [isInputFocused, setIsInputFocused] =
        useState(false);

    const files = useSelector(selectFileTree);

    const searchInputBlockRef =
        useRef<HTMLDivElement>(null);

    const width = useWindowWidth();

    const isNarrowScreen = width < 457;

    const results = useFileSearch(
        {
            query,
            files,
            searchType
        }
    );

    const placeholderText =
        useSearchPlaceholderText(
            {
                isNarrowScreen,
                searchType
            }
        );

    useElementOutsideEvent(
        {
            ref: searchInputBlockRef,
            eventType: "mousedown",
            handler: () => setIsInputFocused(true),
        }
    );

    return (
        <div
            className={styles["search-input"]}
            ref={searchInputBlockRef}
        >
            <input
                className={styles["search-input__field"]}
                type="text"
                placeholder={placeholderText}
                value={query}
                onChange={e => setQuery(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
            />

            {
                isInputFocused
                && results.length > 0 && (
                    <ul className={styles["search-input__list"]}>
                        {
                            results.map(
                                result => {
                                    const Icon =
                                        result.type === FileType.Folder
                                            ? FolderIcon
                                            : FileIcon;
                                    const text =
                                        searchType === SearchType.InFileNames
                                            ? result.fullPath
                                            : result.content;

                                    return (
                                        <li
                                            className={styles["search-input__item"]}
                                            key={result.id}
                                            title={result.fullPath}
                                            onClick={() => onClick(result.id)}
                                        >
                                            <Icon
                                                className={styles["search-input__icon"]}
                                            />

                                            <span className={styles["search-input__text"]}
                                                  title={
                                                      searchType === SearchType.InFileContents
                                                          ? result.fullPath
                                                          : undefined}
                                            >
                                            {text}
                                            </span>
                                        </li>
                                    )
                                }
                            )
                        }
                    </ul>
                )
            }
        </div>
    );
};

export default SearchInput;